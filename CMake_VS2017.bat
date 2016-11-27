@ECHO OFF

FOR /F "usebackq tokens=2,* skip=2" %%L IN (
    `reg query ""HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\VisualStudio\SxS\VS7"" /v 15.0`
) DO (SET VS2017PATH=%%M)

if defined VS2017PATH (
    REM @echo Visual Studio 2017 found at at: "%VS2017PATH%"
    Build\Windows\node\node.exe ./Build/Scripts/Bootstrap.js --task=cmake:vs2017 --vsdir="%VS2017PATH:\=/%" %*
) else (
    @echo Visual Studio 2017 not found
    pause
)
