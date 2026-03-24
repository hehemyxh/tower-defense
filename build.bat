@echo off
chcp 65001 >nul
title 游戏打包工具

echo.
echo  ╔══════════════════════════════════╗
echo  ║   塔防游戏  一键打包工具         ║
echo  ║   输出: dist\game.html           ║
echo  ╚══════════════════════════════════╝
echo.

:: 检查 Node.js 是否已安装
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js！
    echo 请先安装 Node.js: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: 显示 Node 版本
for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo [信息] Node.js 版本: %NODE_VER%
echo.

:: 检查并安装依赖
echo [步骤 1/3] 检查打包依赖...
node -e "require('terser'); require('html-minifier-terser')" >nul 2>&1
if %errorlevel% neq 0 (
    echo   正在安装依赖包，请稍候...
    npm install --save-dev terser html-minifier-terser
    if %errorlevel% neq 0 (
        echo.
        echo [错误] 依赖安装失败，请检查网络连接后重试
        pause
        exit /b 1
    )
    echo   依赖安装完成！
) else (
    echo   依赖已就绪 ✓
)
echo.

:: 运行打包脚本
echo [步骤 2/3] 执行打包 + 混淆...
echo.
node build.js
if %errorlevel% neq 0 (
    echo.
    echo [错误] 打包失败，请查看上方错误信息
    pause
    exit /b 1
)

echo.
echo [步骤 3/3] 完成！
echo.
echo  文件已保存到: %~dp0dist\game.html
echo  直接把这个文件发给朋友就能玩了！
echo.

:: 询问是否打开输出目录
set /p OPEN_DIR=是否打开 dist 文件夹？(Y/N): 
if /i "%OPEN_DIR%"=="Y" (
    explorer "%~dp0dist"
)

echo.
pause
