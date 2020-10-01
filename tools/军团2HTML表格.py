import xlrd
data=xlrd.open_workbook(r'闪击战ID情报.xlsx')
import csv
import re
import os
import subprocess
csv_name=r'闪击战军团ID.csv'
def xlsxToCsv():#首先导出csv
    data=xlrd.open_workbook(r'闪击战ID情报.xlsx')
    
    table=data.sheet_by_name(r'军团列表')

    with open(csv_name,'w+',encoding='utf-8') as f:
        write=csv.writer(f)
        print('共{}条数据\n==========\n'.format(table.nrows))
        for i in range(1,table.nrows):
            row_content=[]
            for j in range(table.ncols):
                ctype=table.cell(i,j).ctype
                cell=table.cell_value(i,j)
                if ctype==2 and cell%1==0:
                    cell=int(cell)
                row_content.append(cell)
            write.writerow(row_content)
    f.close()

def clanHTML():
    HTML_content='<table>\n\
<tr>\
<th>ID</th>\
<th>军团名</th>\
<th>简介</th>\
</tr>\n'
    forID=''

    with open(csv_name,"r",newline='') as f:
        reader = csv.reader(f)
        for i,row in enumerate(reader):
            if i>0:
                cID=row[0]
                cTag=row[1]
                cFullname=row[2]
                cDesc=row[3]
                if row[3]=='':
                    cDesc='无'
                cInfo='<tr><td>{ID}</td><td>[{Tag}] {Fullname}</td><td>{Desc}</td></tr>\n'.format(ID=cID,Tag=cTag,Fullname=cFullname,Desc=cDesc)
                HTML_content += cInfo
    f.close()


    HTML_content+='</table>'
    processedF=open("clanhtml.txt","w+")
    processedF.write(HTML_content)
    print("HTML表格建立完成！")
    processedF.close()

if __name__=='__main__':
    xlsxToCsv()
    clanHTML()
    os.remove(csv_name)
