REM active font 
REG ADD "HKEY_CURRENT_USER\SOFTWARE\MICROSOFT\WINDOWS NT\CURRENTVERSION\FONT MANAGEMENT" /v "Inactive Fonts" /t REG_MULTI_SZ /d ${inactive_font_list} /f