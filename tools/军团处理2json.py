#!usr/bin/env python3

import xlrd
from xlrd import xldate_as_tuple
import json
import re
import os
import subprocess
import time
from datetime import datetime

excel_name = r'闪击战ID情报.xlsx'
def xlsxRead():
    while os.path.exists(excel_name) == False:
        data = input('找不到“{}”，请寻找相关文件后键入路径或放入同一文件夹后回车。\n\
寻找文件：'.format(excel_name))

    data = xlrd.open_workbook(excel_name)
    table = data.sheet_by_name(r'军团列表')
    data_list = []
    for i in range(1,table.nrows):
        title_data =['ID','Tag','Full','Desc','Date','MID','Logo','Ext','Imgs']
        row_content = []
        row_data = {}
        date = 0
        imgExt = []
        logoExists = None
        img_count = 0
        for j in range (table.ncols):
            ctype = table.cell(i,j).ctype
            cell = table.cell_value(i,j)
            if ctype == 2 or ctype == 3 and cell % 1 == 0:
                cell = int(cell)
                #date = datetime(*xldate_as_tuple(cell,0))
                #cell = date.strftime('%Y-%m-%d')
            row_content.append(cell)
            
        if os.path.exists('../img/clan/{}'.format(row_content[0])):#检测是否有相关图片目录
            imgList = os.listdir('../img/clan/{}'.format(row_content[0]))
            imgList.sort()
            print (imgList)
            for i2 in imgList:
                if os.path.splitext(i2)[0] == '0':
                    logoExists = getExtFormat(i2)
                else:
                    if getExtFormat(i2):
                        imgExt.append(getExtFormat(i2))
            print(imgExt)

        row_content.append(logoExists)
        row_content.append(imgExt)
        row_content.append(img_count)
            
        for k in range(len(title_data)):
            row_data[title_data[k]]=row_content[k]
        for m in list(row_data.keys()):
            if not row_data[m]:
                del row_data[m]
        data_list.append(row_data)
        
    print('共{}条数据'.format(i))
    processed_json=json.dumps(data_list,\
                              sort_keys=False,\
                              separators=(',',':'),\
                              ensure_ascii=False)

    f = open('../js/clan.json','w+')
    f.write(processed_json)
    f.close()

    processed_json=json.dumps(data_list,indent=4,\
                              sort_keys=False,\
                              separators=(',',':'),\
                              ensure_ascii=False)
    fTest = open('clan.json','w+')
    fTest.write(processed_json)
    fTest.close()
    print('json建立完成')
    
def getExtFormat(i):
    r = None
    data = os.path.splitext(i)
    print(data)
    if data[0] =='.DS_Store':
        return
    if data[1] == '.png':
        r = 1
    elif data[1] == '.jpg':
        r = 2
    elif data[1] == 'jpeg':
        r = 3
    
    return r
    
if __name__ == '__main__':
    xlsxRead()
