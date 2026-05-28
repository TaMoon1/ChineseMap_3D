Option Explicit

Dim shell
Dim command

Set shell = CreateObject("WScript.Shell")

command = "cmd /c cd /d D:\ChineseMap_3D_2 && npm run dev -- --host 127.0.0.1 --port 5173"

' 0 = hidden window, False = do not wait
shell.Run command, 0, False
