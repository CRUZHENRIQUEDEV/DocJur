/* ================================================================
   DocJur — assets/js/store.js
   Store com camada de Storage EXTENSÍVEL:
     - Driver LocalStorageDriver (agora)
     - Interface genérica: get/set/remove/listKeys/clear
     - P/ futuro: SqliteDriver, IndexedDbDriver, SupabaseDriver, etc
       (basta implementar a mesma interface e trocar via useDriver)

   Entidades separadas (prontas para tabelas SQL separadas):
     lawyers      - registro de advogados (o mesmo advogado em N docs)
     clients      - registro de clientes reutilizáveis
     defendants   - réus reutilizáveis
     documents    - SavedDoc (id, título, conteúdo, snapshot de dados, FKs)
     preferences  - tema, zoom, defaults de data
     lastRefs     - última entidade/documento acessados

   Não renderiza UI.
   ================================================================ */
/* global DocJurUtils */
/** @typedef {Record<string, string>} StorePhData */
/** @typedef {{ id: string, title: string, createdAt: string, updatedAt: string, content: string, data: StorePhData, rawSnapshot: StorePhData, lawyerId?: string|null, clientId?: string|null, defendantId?: string|null, categoryId?: string|null, templateId?: string|null }} StoreSavedDoc */
const DocJurStore = (() => {
  const { $, $$, formatDateBR, currentDateBR, genDocId, escHtml } = DocJurUtils;

  // ============================================================
  // 1. STORAGE DRIVERS — interface + implementações
  // ============================================================
  /**
   * @typedef {"lawyers"|"clients"|"defendants"|"documents"|"preferences"|"lastRefs"|"dataSnapshots"} EntityName
   *
   * @typedef {Object} StorageDriver
   * @property {(ent: EntityName, id: string) => any} get
   * @property {(ent: EntityName, id: string, val: any) => void} set
   * @property {(ent: EntityName, id: string) => void} remove
   * @property {(ent: EntityName) => Array<any>} list
   * @property {(ent: EntityName) => Record<string,any>} all
   * @property {(ent: EntityName) => void} clearAll
   * @property {(ent: EntityName, val: any) => string} insert  (gera id se faltar, retorna id)
   * @property {(ent: EntityName, id: string, patch: any) => any} update
   */

  /**
   * LocalStorageDriver — tabela=entidade, chave= `docjur_${ent}__${id}`.
   * Mantém compatibilidade com chaves antigas (docjur_data / docjur_docs / docjur_last_doc)
   * na migração inicial (ver migrateLegacy).
   * @type {StorageDriver & { _pref: string, _key: (ent: EntityName, id: string|any) => string, _keysOf: (ent: EntityName) => string[] }}
   */
  const LocalStorageDriver = {
    _pref: "docjur_",
    /**
     * @param {EntityName} ent
     * @param {string|any} id
     */
    _key(ent, id) {
      return this._pref + ent + "__" + String(id);
    },
    /** @param {EntityName} ent */
    _keysOf(ent) {
      const prefix = this._pref + ent + "__";
      /** @type {string[]} */
      const out = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) out.push(k);
      }
      return out;
    },
    /**
     * @param {EntityName} ent
     * @param {string} id
     */
    get(ent, id) {
      const raw = localStorage.getItem(this._key(ent, id));
      return raw ? JSON.parse(raw) : null;
    },
    /**
     * @param {EntityName} ent
     * @param {string} id
     * @param {any} val
     */
    set(ent, id, val) {
      localStorage.setItem(this._key(ent, id), JSON.stringify(val));
    },
    /**
     * @param {EntityName} ent
     * @param {string} id
     */
    remove(ent, id) {
      localStorage.removeItem(this._key(ent, id));
    },
    /** @param {EntityName} ent */
    all(ent) {
      /** @type {Record<string, any>} */
      const out = {};
      this._keysOf(ent).forEach((k) => {
        try {
          const raw = localStorage.getItem(k);
          if (!raw) return;
          const v = JSON.parse(raw);
          out[v.id || k.slice(k.lastIndexOf("__") + 2)] = v;
        } catch {}
      });
      return out;
    },
    /** @param {EntityName} ent */
    list(ent) {
      return Object.values(this.all(ent)).sort((a, b) =>
        (a.updatedAt || a.createdAt || "") < (b.updatedAt || b.createdAt || "")
          ? 1
          : -1,
      );
    },
    /** @param {EntityName} ent */
    clearAll(ent) {
      this._keysOf(ent).forEach((k) => localStorage.removeItem(k));
    },
    /**
     * @param {EntityName} ent
     * @param {any} val
     */
    insert(ent, val) {
      const id =
        val.id ||
        (ent === "documents"
          ? genDocId()
          : "id_" + Math.random().toString(36).slice(2, 10));
      const now = new Date().toISOString();
      const record = {
        ...val,
        id,
        createdAt: val.createdAt || now,
        updatedAt: now,
      };
      this.set(ent, id, record);
      return id;
    },
    /**
     * @param {EntityName} ent
     * @param {string} id
     * @param {any} patch
     */
    update(ent, id, patch) {
      const existing = this.get(ent, id) || {};
      const next = {
        ...existing,
        ...patch,
        id,
        updatedAt: new Date().toISOString(),
      };
      this.set(ent, id, next);
      return next;
    },
  };

  /** Driver ativo (substitua por qualquer outro amanhã).
   * @type {any}
   */
  let driver = LocalStorageDriver;
  /** Troca o driver em runtime — útil p/ migração ou testes.
   * @param {StorageDriver | any} d
   */
  function useDriver(d) {
    driver = d;
    migrateLegacy();
  }

  // ============================================================
  // 2. MIGRAÇÃO LEGADA — traz dados do localStorage antigo.
  // ============================================================
  /** Roda UMA vez por sessão: chaves antigas → entidades novas. */
  function migrateLegacy() {
    try {
      const migrated = localStorage.getItem("docjur__migrated");
      if (!migrated) {
        // 2.1 Mapa docjur_docs (antigo Record<id, SavedDoc>) → entity "documents" (1 record por doc)
        const oldDocs = JSON.parse(localStorage.getItem("docjur_docs") || "{}");
        Object.entries(oldDocs).forEach(
          (/** @type {[string, any]} */ [id, doc]) => {
            if (!driver.get("documents", id)) driver.set("documents", id, doc);
          },
        );
        const last = localStorage.getItem("docjur_last_doc");
        if (last)
          driver.set("lastRefs", "lastDocId", { id: "lastDocId", value: last });

        // 2.2 Snapshot de dados do formulário (formato cru, sem datas formatadas)
        const oldData = JSON.parse(
          localStorage.getItem("docjur_data") || "null",
        );
        if (oldData)
          driver.set("dataSnapshots", "currentForm", {
            id: "currentForm",
            value: oldData,
          });

        localStorage.setItem("docjur__migrated", new Date().toISOString());
      }
    } catch (e) {
      console.warn("[DocJur.migrateLegacy]", e);
    }
  }

  // ============================================================
  // 3. FORMULÁRIO — dados temporários do doc aberto (data-ph)
  // ============================================================
  const DATE_KEYS = new Set(["DOC_DATA", "PROC_DATA", "CLI_NASC"]);

  /** @returns {StorePhData} — dados prontos para o editor (datas formatadas) */
  function collectData() {
    /** @type {Record<string, string>} */
    const data = {};
    /** @type {NodeListOf<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>} */
    // @ts-ignore — $$ retorna NodeList generico mas filtramos para form controls
    const inputs = $$("input[data-ph], select[data-ph], textarea[data-ph]");
    inputs.forEach((el) => {
      const key = el.dataset.ph || "";
      let val = el.value || "";
      if (DATE_KEYS.has(key)) val = formatDateBR(val);
      data[key] = val;
    });
    return data;
  }

  /** Apenas valores crus (preenchimento fiel dos <inputs>) @returns {StorePhData} */
  function rawSnapshot() {
    /** @type {Record<string, string>} */
    const obj = {};
    /** @type {NodeListOf<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>} */
    // @ts-ignore
    const inputs = $$("input[data-ph], select[data-ph], textarea[data-ph]");
    inputs.forEach((el) => {
      obj[el.dataset.ph || ""] = el.value || "";
    });
    return obj;
  }

  /** Preenche formulário de volta. @param {StorePhData|Record<string,any>|null|undefined} data */
  function loadData(data) {
    if (!data) return;
    /** @type {NodeListOf<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>} */
    // @ts-ignore
    const inputs = $$("input[data-ph], select[data-ph], textarea[data-ph]");
    inputs.forEach((el) => {
      const key = el.dataset.ph || "";
      const v = /** @type {any} */ (data)[key];
      if (v === undefined || v === null) return;
      if (DATE_KEYS.has(key) && typeof v === "string" && v.includes(" de "))
        return;
      el.value = String(v);
    });
  }

  /** Limpa todos os inputs. */
  function clearData() {
    /** @type {NodeListOf<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>} */
    // @ts-ignore
    const inputs = $$("input[data-ph], select[data-ph], textarea[data-ph]");
    inputs.forEach((el) => {
      el.value = "";
    });
  }

  /** Salva snapshot do formulário em entity dataSnapshots (chave currentForm) */
  function persistData() {
    driver.set("dataSnapshots", "currentForm", {
      id: "currentForm",
      value: rawSnapshot(),
    });
  }

  /** Restaura values crus + data atual padrão + preferências. */
  function restoreData() {
    try {
      const snap = driver.get("dataSnapshots", "currentForm");
      if (snap && snap.value) {
        Object.entries(snap.value).forEach(
          (/** @type {[string, any]} */ [k, v]) => {
            const el = /** @type {HTMLInputElement|null} */ (
              document.querySelector(`[data-ph="${escHtml(k)}"]`)
            );
            if (el && v !== undefined && v !== null) el.value = String(v);
          },
        );
      }
    } catch (e) {
      console.warn("[DocJurStore.restoreData]", e);
    }
    const docData = /** @type {HTMLInputElement|null} */ ($("#doc_data"));
    if (docData && !docData.value) docData.value = currentDateBR();
  }

  // ============================================================
  // 4. PREFERÊNCIAS — tema, zoom, defaults
  // ============================================================
  /** @typedef {{ id: string, theme: "light"|"dark"|"system", zoom: number, defaultEditorFont: string, defaultEditorSize: string, confirmClearData: boolean, autoSaveFormMs: number, uiLeftCollapsed: boolean, uiRightCollapsed: boolean, uiEditorCollapsed: boolean }} StorePrefs */
  /** @type {StorePrefs} */
  const DEF_PREFS = {
    id: "global",
    theme: "light", // "light" | "dark" | "system"
    zoom: 1.0,
    defaultEditorFont: "Times New Roman, Georgia, serif",
    defaultEditorSize: "3", // 1..7, execCommand fontSize
    confirmClearData: true,
    autoSaveFormMs: 1500, // debounce persistData ao digitar
    uiLeftCollapsed: false,
    uiRightCollapsed: false,
    uiEditorCollapsed: false,
  };
  /** @returns {StorePrefs} */
  function getPrefs() {
    return /** @type {StorePrefs} */ ({
      ...DEF_PREFS,
      ...(driver.get("preferences", "global") || {}),
    });
  }
  /** @param {Partial<StorePrefs>} patch */
  function setPrefs(patch) {
    return driver.update("preferences", "global", patch);
  }

  // ============================================================
  // 5. ENTIDADES REUTILIZÁVEIS — Advogado / Cliente / Réu
  //   (hoje usadas para CRUD no storage; amanhã, tela de cadastro)
  // ============================================================
  /** @typedef {"lawyers"|"clients"|"defendants"} PartyEntity */
  /** @type {Record<PartyEntity, PartyEntity>} */
  const ENT = {
    lawyers: "lawyers",
    clients: "clients",
    defendants: "defendants",
  };
  /**
   * Extrai advogado/cliente/rédos campos do formulário → objeto normalizado.
   * @returns {{ lawyer: Record<string,string>, client: Record<string,string>, defendant: Record<string,string> }}
   */
  function snapshotParties() {
    const raw = rawSnapshot();
    return {
      lawyer: {
        name: raw.ADV_NOME || "",
        oab: raw.ADV_OAB || "",
        oabUf: raw.ADV_UF || "",
        cpf: raw.ADV_CPF || "",
        email: raw.ADV_EMAIL || "",
        phone: raw.ADV_TEL || "",
        address: raw.ADV_END || "",
        zip: raw.ADV_CEP || "",
        city: raw.ADV_CIDADE || "",
        state: raw.ADV_UF || "",
        firmName: raw.ESC_RAZAO || "",
        firmCnpj: raw.ESC_CNPJ || "",
        firmFantasia: raw.ESC_FANT || "",
      },
      client: {
        name: raw.CLI_NOME || "",
        type: raw.CLI_TIPO || "",
        doc: raw.CLI_DOC || "",
        rg: raw.CLI_RG || "",
        nationality: raw.CLI_NAC || "",
        maritalStatus: raw.CLI_EC || "",
        profession: raw.CLI_PROF || "",
        birthDate: raw.CLI_NASC || "",
        email: raw.CLI_EMAIL || "",
        phone: raw.CLI_TEL || "",
        address: raw.CLI_END || "",
        zip: raw.CLI_CEP || "",
        city: raw.CLI_CIDADE || "",
        state: raw.CLI_UF || "",
      },
      defendant: {
        name: raw.REU_NOME || "",
        type: raw.REU_TIPO || "",
        doc: raw.REU_DOC || "",
        rg: raw.REU_RG || "",
        nationality: raw.REU_NAC || "",
        legalRep: raw.REU_REP || "",
        email: raw.REU_EMAIL || "",
        phone: raw.REU_TEL || "",
        address: raw.REU_END || "",
        zip: raw.REU_CEP || "",
        city: raw.REU_CIDADE || "",
        state: raw.REU_UF || "",
      },
    };
  }
  /**
   * Salva advogado/corrente como contato reutilizável (se nome não vazio).
   * @param {PartyEntity} entity
   * @returns {string|null}
   */
  function saveCurrentParty(entity) {
    const { lawyer, client, defendant } = snapshotParties();
    /** @type {Record<PartyEntity, Record<string,string>>} */
    const map = { lawyers: lawyer, clients: client, defendants: defendant };
    const record = map[entity];
    if (!record || !record.name || !record.name.trim()) return null;
    const nameKey = record.name.trim().toLowerCase();
    // Evita duplicação exata por nome
    const existing = driver
      .list(entity)
      .find(
        (/** @type {any} */ r) =>
          r.name && r.name.trim().toLowerCase() === nameKey,
      );
    if (existing) return driver.update(entity, existing.id, record).id;
    return driver.insert(entity, record);
  }
  /**
   * Preenche o formulário com dados de uma entidade salva.
   * @param {PartyEntity} entity
   * @param {string} id
   */
  function applyPartyToForm(entity, id) {
    const rec = /** @type {any} */ (driver.get(entity, id));
    if (!rec) return;
    /** @type {Record<PartyEntity, string>} */
    const PREFIX = { lawyers: "ADV_", clients: "CLI_", defendants: "REU_" };
    const p = PREFIX[entity];
    const f = (/** @type {string} */ suffix, /** @type {any} */ value) => {
      const el = /** @type {HTMLInputElement|null} */ (
        $(`[data-ph="${p}${suffix}"]`)
      );
      if (el && value !== undefined) el.value = String(value);
    };
    if (entity === "lawyers") {
      f("NOME", rec.name);
      f("OAB", rec.oab);
      f("CPF", rec.cpf);
      f("EMAIL", rec.email);
      f("TEL", rec.phone);
      f("END", rec.address);
      f("CEP", rec.zip);
      f("CIDADE", rec.city);
      f("UF", rec.state || rec.oabUf);
      f("UF", rec.state || rec.oabUf);
      f("", "");
      const raz = /** @type {HTMLInputElement|null} */ (
        $('[data-ph="ESC_RAZAO"]')
      );
      if (raz && rec.firmName) raz.value = rec.firmName;
      const cnp = /** @type {HTMLInputElement|null} */ (
        $('[data-ph="ESC_CNPJ"]')
      );
      if (cnp && rec.firmCnpj) cnp.value = rec.firmCnpj;
      const fan = /** @type {HTMLInputElement|null} */ (
        $('[data-ph="ESC_FANT"]')
      );
      if (fan && rec.firmFantasia) fan.value = rec.firmFantasia;
    } else if (entity === "clients") {
      f("NOME", rec.name);
      const t = /** @type {HTMLSelectElement|null} */ (
        $('[data-ph="CLI_TIPO"]')
      );
      if (t && rec.type) t.value = rec.type;
      f("DOC", rec.doc);
      f("RG", rec.rg);
      f("NAC", rec.nationality);
      const ec = /** @type {HTMLSelectElement|null} */ (
        $('[data-ph="CLI_EC"]')
      );
      if (ec && rec.maritalStatus) ec.value = rec.maritalStatus;
      f("PROF", rec.profession);
      f("NASC", rec.birthDate);
      f("EMAIL", rec.email);
      f("TEL", rec.phone);
      f("END", rec.address);
      f("CEP", rec.zip);
      f("CIDADE", rec.city);
      f("UF", rec.state);
    } else if (entity === "defendants") {
      f("NOME", rec.name);
      const t = /** @type {HTMLSelectElement|null} */ (
        $('[data-ph="REU_TIPO"]')
      );
      if (t && rec.type) t.value = rec.type;
      f("DOC", rec.doc);
      f("RG", rec.rg);
      f("NAC", rec.nationality);
      f("REP", rec.legalRep);
      f("EMAIL", rec.email);
      f("TEL", rec.phone);
      f("END", rec.address);
      f("CEP", rec.zip);
      f("CIDADE", rec.city);
      f("UF", rec.state);
    }
  }

  // ============================================================
  // 6. DOCUMENTS — SavedDoc (com FKs opcionais para lawyer/client/defendant)
  // ============================================================
  function loadAllDocs() {
    return driver.all("documents");
  }
  function listDocs() {
    return driver.list("documents");
  }
  /** @param {string} id */
  function getDoc(id) {
    return driver.get("documents", id);
  }

  /**
   * Upsert de documento. Gera advogado/cliente/résem registros (se houver nome).
   * @param {string|null} id — null/"" cria novo
   * @param {string} title
   * @param {string} content — HTML editor
   * @returns {{ id: string, doc: StoreSavedDoc }}
   */
  function upsertDoc(id, title, content) {
    const existing = id
      ? /** @type {StoreSavedDoc|null} */ (driver.get("documents", id))
      : null;
    const now = new Date().toISOString();
    // Salva entidades reutilizáveis em paralelo (opcional)
    const p = snapshotParties();
    const lawyerId =
      p.lawyer && p.lawyer.name
        ? saveCurrentParty(ENT.lawyers)
        : (existing && existing.lawyerId) || null;
    const clientId =
      p.client && p.client.name
        ? saveCurrentParty(ENT.clients)
        : (existing && existing.clientId) || null;
    const defendantId =
      p.defendant && p.defendant.name
        ? saveCurrentParty(ENT.defendants)
        : (existing && existing.defendantId) || null;

    const docId = (existing && existing.id) || genDocId();
    /** @type {StoreSavedDoc} */
    const doc = {
      id: docId,
      title: title || "Documento sem título",
      createdAt: (existing && existing.createdAt) || now,
      updatedAt: now,
      content,
      data: collectData(),
      rawSnapshot: rawSnapshot(),
      lawyerId,
      clientId,
      defendantId,
      categoryId: (existing && existing.categoryId) || null,
      templateId: (existing && existing.templateId) || null,
    };
    driver.set("documents", docId, doc);
    driver.set("lastRefs", "lastDocId", { id: "lastDocId", value: docId });
    return { id: docId, doc };
  }
  /** @param {string} id */
  function deleteDoc(id) {
    driver.remove("documents", id);
    const last = driver.get("lastRefs", "lastDocId");
    if (last && last.value === id)
      driver.set("lastRefs", "lastDocId", { id: "lastDocId", value: null });
  }
  /** @param {string} id */
  function rememberDoc(id) {
    driver.set("lastRefs", "lastDocId", { id: "lastDocId", value: id });
  }
  /** @returns {string|null} */
  function lastDocId() {
    const last = driver.get("lastRefs", "lastDocId");
    return (last && last.value) || null;
  }

  // ============================================================
  // 7. BINDS — formulário → persistência
  // ============================================================
  /** @type {ReturnType<typeof setTimeout>|null} */
  let _debTimer = null;
  /** @param {(() => void)|undefined|any} [onChange] */
  function bindFormEvents(onChange) {
    const ms = getPrefs().autoSaveFormMs || 800;
    const handler = () => {
      if (_debTimer) clearTimeout(_debTimer);
      _debTimer = setTimeout(() => {
        persistData();
        if (typeof onChange === "function") onChange();
      }, ms);
    };
    /** @type {NodeListOf<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>} */
    // @ts-ignore
    const inputs = $$("input[data-ph], select[data-ph], textarea[data-ph]");
    inputs.forEach((el) => {
      el.addEventListener("input", handler);
      el.addEventListener("change", handler);
    });
  }

  // ============================================================
  // 8. INIT — roda migração + expõe driver
  // ============================================================
  migrateLegacy();

  return {
    // Storage extensível
    STORAGE: {
      ENTITIES: /** @type {Record<string, EntityName>} */ ({
        LAWYERS: "lawyers",
        CLIENTS: "clients",
        DEFENDANTS: "defendants",
        DOCUMENTS: "documents",
        PREFERENCES: "preferences",
        LAST_REFS: "lastRefs",
        DATA_SNAPSHOTS: "dataSnapshots",
      }),
    },
    LocalStorageDriver,
    useDriver,
    get driver() {
      return driver;
    },

    // Preferências (tema, zoom, defaults)
    getPrefs,
    setPrefs,

    // Formulário
    DATE_KEYS,
    collectData,
    loadData,
    clearData,
    rawSnapshot,
    persistData,
    restoreData,

    // Entidades reutilizáveis
    snapshotParties,
    saveCurrentParty,
    applyPartyToForm,
    listEntity: (/** @type {EntityName} */ e) => driver.list(e),
    getEntity: (/** @type {EntityName} */ e, /** @type {string} */ id) =>
      driver.get(e, id),
    deleteEntity: (/** @type {EntityName} */ e, /** @type {string} */ id) =>
      driver.remove(e, id),

    // Documents
    loadAllDocs,
    listDocs,
    getDoc,
    upsertDoc,
    deleteDoc,
    rememberDoc,
    lastDocId,

    // binds
    bindFormEvents,
  };
})();

/** @type {any} */ (window).DocJurStore = DocJurStore;
