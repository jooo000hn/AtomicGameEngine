
@echo OFF

set vsdir=%~1
set atomicroot=%~2
set solutiondir=%~3
set cmake="%vsdir%\Common7\IDE\CommonExtensions\Microsoft\CMake\CMake\bin\cmake.exe"

call "%vsdir%\Common7\Tools\VsDevCmd.bat"
%cmake% -E make_directory "%solutiondir%"
%cmake% -E chdir "%solutiondir%" %cmake% "%atomicroot%" -DATOMIC_DEV_BUILD=1 -G "Visual Studio 15 2017 Win64"
