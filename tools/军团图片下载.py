import os
import xlrd
import requests

def downloadClanPic():
    excel_name = r'WOTB军团信息收集表（收集结果）.xlsx'
    file_url = 'https://img-blog.csdnimg.cn/20190720140321140.png'
    pic = requests.get(file_url)
    
    while not os.path.exists(excel_name):
        data = input('找不到“{}”，请寻找相关文件后键入路径或放入同一文件夹后回车。\n\
寻找文件：'.format(excel_name))
    data = xlrd.open_workbook(excel_name)
    table = data.sheet_by_name(r'WOTB军团信息收集表')
    datalist = []
    url = ''
    for i in range(1,table.nrows):
        url = table.hyperlink_map.get((6,i))
        print(url)
        for j in range(table.ncols):
            cell = table.cell_value(i,j)
            #print(cell)
    '''
    if not os.path.exists('./10492/'):
        os.makedirs('./10492/')
    with open(os.path.join(os.path.dirname(os.path.abspath("__file__")),'test.png'), 'wb+') as downloaded_file:
        downloaded_file.write(pic.content)
    '''
if __name__ == '__main__':
    downloadClanPic()
