Option Explicit

Dim shell
Dim command

Set shell = CreateObject("WScript.Shell")

command = "cmd /c for /f ""tokens=5"" %a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do taskkill /PID %a /F"

' 0 = hidden window, True = wait for shutdown to finish
shell.Run command, 0, True
