#!usr/bin/env python3
import os
import openpyxl
#import requests


clan_data_set = []
def getClanPicLink():
    file_list = os.listdir('./')
    for item in file_list:
        if "WOTB军团信息收集表" and ".xlsx" in item:
            excel_name = item
    #file_url = 'https://img-blog.csdnimg.cn/20190720140321140.png'
    #pic = requests.get(file_url)
    while not os.path.exists(excel_name):
        excel_name = input(r'找不到“{}”，请寻找相关文件后键入路径或放入同一文件夹后回车。\n寻找文件：'.format(r'WOTB军团信息收集表'))

    wb = openpyxl.load_workbook(excel_name)
    sheet = wb.active
    cell = sheet.cell
    maxrow = sheet.max_row
    for i in range(2,maxrow+1):
        clan_data = {}
        pic_list = []
        count = 1
        if not cell(i,1).value:
            return
        clan_data['ID'] = int(cell(i,3).value)
        if cell(i,7).value:
            clan_data['logo'] = cell(i,7).hyperlink.target
        for j in range(13,19):
            if cell(i,j).value:
                pic_list.append(cell(i,j).hyperlink.target)
                count+=1
        if pic_list:
            clan_data['pic'] = pic_list
        clan_data_set.append(clan_data)
#def downloadClanPic():
    '''if not os.path.exists('./10492/'):
        os.makedirs('./10492/')
    with open(os.path.join(os.path.dirname(os.path.abspath("__file__")),'test.png'), 'wb+') as downloaded_file:
        #downloaded_file.write(pic.content)
    print(clan_data_set)'''
if __name__ == '__main__':
    getClanPicLink()
    #downloadClanPic()
