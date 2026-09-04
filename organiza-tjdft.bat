@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
cd /d "%~dp0"

if not exist "Peticao\TJDFT" (
  echo ERRO: Pasta Peticao\TJDFT nao encontrada a partir de %cd%
  pause
  exit /b 1
)

set "ROOT=Peticao\TJDFT"
set "PASTAS=01-GERAL;02-TRANSITO;03-BANCO-CARTAO;04-COBRANCA;05-CONSUMIDOR;06-VIZINHANCA;07-DESPEJO;08-ENSINO;09-EXEC-EXTRAJUDICIAL;10-EXEC-JUDICIAL;11-LOCACAO;12-NEGATIVACAO;13-TURISMO;14-SAUDE;15-PREST-SERVICO;16-TELECOM;17-AEREO;18-RODOVIARIO;19-VEICULOS;20-FAZENDA-DF;21-CAESB-CEB;22-COMPRA-VENDA;23-CONSORCIO"

for %%P in (%PASTAS%) do (
  if not exist "%ROOT%\%%P" mkdir "%ROOT%\%%P"
  echo Criada pasta: %%P
)

set MOV=0
set NAO=0
for %%F in ("%ROOT%\*.docx") do (
  set "NOME=%%~nxF"
  call :moveByPrefix "!NOME!"
)

echo.
echo === RESULTADO ===
echo Arquivos movidos : %MOV%
echo Arquivos sem mapeamento (ficarao na raiz TJDFT): %NAO%
echo.
echo PDFs e Peticao.docx foram mantidos na raiz da pasta TJDFT.
pause
exit /b 0

:moveByPrefix
set "N=%~1"
rem ---- Prefixo 1. -> GERAL (1.1,1.2,1.3)
echo "%N%" | findstr /b /r /c:"\"1\.[0-9]" >nul && set "D=01-GERAL" && goto :doMove
rem ---- Prefixo 2. -> TRANSITO
echo "%N%" | findstr /b /r /c:"\"2\.[0-9]" >nul && set "D=02-TRANSITO" && goto :doMove
rem ---- Prefixo 3. -> BANCO (3.01 … 3.16)
echo "%N%" | findstr /b /r /c:"\"3\." >nul && set "D=03-BANCO-CARTAO" && goto :doMove
rem ---- Prefixo 4. -> COBRANCA
echo "%N%" | findstr /b /r /c:"\"4\." >nul && set "D=04-COBRANCA" && goto :doMove
rem ---- Prefixo 5. -> CONSUMIDOR
echo "%N%" | findstr /b /r /c:"\"5\." >nul && set "D=05-CONSUMIDOR" && goto :doMove
rem ---- Prefixo 6. -> VIZINHANCA / CONDOMINIO
echo "%N%" | findstr /b /r /c:"\"6\." >nul && set "D=06-VIZINHANCA" && goto :doMove
rem ---- Prefixo 7. -> DESPEJO
echo "%N%" | findstr /b /r /c:"\"7\." >nul && set "D=07-DESPEJO" && goto :doMove
rem ---- Prefixo 8. -> ENSINO
echo "%N%" | findstr /b /r /c:"\"8\." >nul && set "D=08-ENSINO" && goto :doMove
rem ---- Prefixo 9. -> EXEC EXTRAJUDICIAL
echo "%N%" | findstr /b /r /c:"\"9\." >nul && set "D=09-EXEC-EXTRAJUDICIAL" && goto :doMove
rem ---- Prefixo 10. -> EXEC JUDICIAL
echo "%N%" | findstr /b /r /c:"\"10\." >nul && set "D=10-EXEC-JUDICIAL" && goto :doMove
rem ---- Prefixo 11. -> LOCACAO
echo "%N%" | findstr /b /r /c:"\"11\." >nul && set "D=11-LOCACAO" && goto :doMove
rem ---- Prefixo 12. -> NEGATIVACAO
echo "%N%" | findstr /b /r /c:"\"12\." >nul && set "D=12-NEGATIVACAO" && goto :doMove
rem ---- Prefixo 13. -> TURISMO
echo "%N%" | findstr /b /r /c:"\"13\." >nul && set "D=13-TURISMO" && goto :doMove
rem ---- Prefixo 14. -> SAUDE
echo "%N%" | findstr /b /r /c:"\"14\." >nul && set "D=14-SAUDE" && goto :doMove
rem ---- Prefixo 15. -> PREST SERVICO
echo "%N%" | findstr /b /r /c:"\"15\." >nul && set "D=15-PREST-SERVICO" && goto :doMove
rem ---- Prefixo 16. -> TELECOM
echo "%N%" | findstr /b /r /c:"\"16\." >nul && set "D=16-TELECOM" && goto :doMove
rem ---- Prefixo 17. -> AEREO
echo "%N%" | findstr /b /r /c:"\"17\." >nul && set "D=17-AEREO" && goto :doMove
rem ---- Prefixo 18. -> RODOVIARIO
echo "%N%" | findstr /b /r /c:"\"18\." >nul && set "D=18-RODOVIARIO" && goto :doMove
rem ---- Prefixo 19. -> VEICULOS
echo "%N%" | findstr /b /r /c:"\"19\." >nul && set "D=19-VEICULOS" && goto :doMove
rem ---- Prefixo 20. -> FAZENDA DF
echo "%N%" | findstr /b /r /c:"\"20\." >nul && set "D=20-FAZENDA-DF" && goto :doMove
rem ---- Prefixo 21. -> CAESB / CEB
echo "%N%" | findstr /b /r /c:"\"21\." >nul && set "D=21-CAESB-CEB" && goto :doMove
rem ---- Prefixo 22. -> COMPRA VENDA
echo "%N%" | findstr /b /r /c:"\"22\." >nul && set "D=22-COMPRA-VENDA" && goto :doMove
rem ---- Prefixo 23. -> CONSORCIO
echo "%N%" | findstr /b /r /c:"\"23\." >nul && set "D=23-CONSORCIO" && goto :doMove
set /A NAO+=1
echo   (sem mapeamento) %N%
goto :eof

:doMove
move /y "%ROOT%\%N%" "%ROOT%\%D%\%N%" >nul
if errorlevel 1 (
  echo FALHA AO MOVER: %N% -^> %D%
) else (
  echo   movido: %N% -^> %D%
  set /A MOV+=1
)
goto :eof
