#!usr/bin/env python3

import xlrd
from xlrd import xldate_as_tuple
import json
import re
import os
import subprocess
import time
from datetime import datetime

file_list = os.listdir("../")
fname_keyword = r"闪击战团ID"
for index in file_list:
    if fname_keyword and ".xlsx" in index:
        excel_name = "../" +  index
        
def xlsxRead():
    while not os.path.exists(excel_name):
        data = input("找不到'{}'，请寻找相关文件后键入路径或放入同一文件夹后回车。\n\
寻找文件：".format(excel_name))
    head = """USE wotb_clanbook;
INSERT INTO clan (clan_id, tag, fullname, description, date_establishment)
VALUES"""
    data = xlrd.open_workbook(excel_name)
    table = data.sheet_by_name(r"军团列表")
    data_list = head
    for i in range(1,table.nrows):
        row_data = ()
        date=""

        for j in range (table.ncols-1):
            ctype = table.cell(i,j).ctype
            cell = table.cell_value(i,j)
            if j == 1:
                str(cell)
            if ctype==1 and '\'=' in cell:
                cell=cell.replace('\'=','=')
                
            if ctype == 2 and cell % 1 == 0:
                cell = int(cell)
                
            if ctype == 3:
                if cell=='':
                    cell = 'Null'
                else:
                    cell = int(cell)
                    date = datetime(*xldate_as_tuple(cell,0))
                    cell = date.strftime('%Y-%m-%d')
                
            row_data += (cell,)
        if i < table.nrows-1:
            data_list+=str(row_data)+",\n"
        else:
            data_list+=str(row_data)+";"
        
    print('共{}条数据'.format(i))

    f = open('./clan.sql','w+')
    data_list=data_list.replace("'')","Null)")
    f.write(data_list)
    f.close()
    print('SQL建立完成')
    
if __name__ == '__main__':
    xlsxRead()
