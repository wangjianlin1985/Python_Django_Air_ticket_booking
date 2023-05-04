from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.Flight.models import Flight
from apps.SeatType.models import SeatType
from apps.StationInfo.models import StationInfo
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台航班信息添加
    def get(self,request):
        seatTypes = SeatType.objects.all()  # 获取所有座位席别
        stationInfos = StationInfo.objects.all()  # 获取所有机场信息
        context = {
            'seatTypes': seatTypes,
            'stationInfos': stationInfos,
        }

        # 使用模板
        return render(request, 'Flight/flight_frontAdd.html', context)

    def post(self, request):
        flight = Flight() # 新建一个航班信息对象然后获取参数
        flight.flightNumber = request.POST.get('flight.flightNumber')
        try:
            flight.flightPhoto = self.uploadImageFile(request,'flight.flightPhoto')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        flight.startStation = StationInfo.objects.get(stationId=request.POST.get('flight.startStation.stationId'))
        flight.endStation = StationInfo.objects.get(stationId=request.POST.get('flight.endStation.stationId'))
        flight.startTime = request.POST.get('flight.startTime')
        flight.endTime = request.POST.get('flight.endTime')
        flight.totalTime = request.POST.get('flight.totalTime')
        flight.seatType = SeatType.objects.get(seatTypeId=request.POST.get('flight.seatType.seatTypeId'))
        flight.price = float(request.POST.get('flight.price'))
        flight.seatNumber = int(request.POST.get('flight.seatNumber'))
        flight.leftSeatNumber = int(request.POST.get('flight.leftSeatNumber'))
        flight.flightDesc = request.POST.get('flight.flightDesc')
        flight.save() # 保存航班信息信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class FrontModifyView(BaseView):  # 前台修改航班信息
    def get(self, request, flightId):
        context = {'flightId': flightId}
        return render(request, 'Flight/flight_frontModify.html', context)


class FrontListView(BaseView):  # 前台航班信息查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        flightNumber = self.getStrParam(request, 'flightNumber')
        startStation_stationId = self.getIntParam(request, 'startStation.stationId')
        endStation_stationId = self.getIntParam(request, 'endStation.stationId')
        startTime = self.getStrParam(request, 'startTime')
        endTime = self.getStrParam(request, 'endTime')
        seatType_seatTypeId = self.getIntParam(request, 'seatType.seatTypeId')
        # 然后条件组合查询过滤
        flights = Flight.objects.all()
        if flightNumber != '':
            flights = flights.filter(flightNumber__contains=flightNumber)
        if startStation_stationId != '0':
            flights = flights.filter(startStation=startStation_stationId)
        if endStation_stationId != '0':
            flights = flights.filter(endStation=endStation_stationId)
        if startTime != '':
            flights = flights.filter(startTime__contains=startTime)
        if endTime != '':
            flights = flights.filter(endTime__contains=endTime)
        if seatType_seatTypeId != '0':
            flights = flights.filter(seatType=seatType_seatTypeId)
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(flights, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        flights_page = self.paginator.page(self.currentPage)

        # 获取所有座位席别
        seatTypes = SeatType.objects.all()
        # 获取所有机场信息
        stationInfos = StationInfo.objects.all()
        # 构造模板需要的参数
        context = {
            'seatTypes': seatTypes,
            'stationInfos': stationInfos,
            'flights_page': flights_page,
            'flightNumber': flightNumber,
            'startStation_stationId': int(startStation_stationId),
            'endStation_stationId': int(endStation_stationId),
            'startTime': startTime,
            'endTime': endTime,
            'seatType_seatTypeId': int(seatType_seatTypeId),
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'Flight/flight_frontquery_result.html', context)


class FrontShowView(View):  # 前台显示航班信息详情页
    def get(self, request, flightId):
        # 查询需要显示的航班信息对象
        flight = Flight.objects.get(flightId=flightId)
        context = {
            'flight': flight
        }
        # 渲染模板显示
        return render(request, 'Flight/flight_frontshow.html', context)


class ListAllView(View): # 前台查询所有航班信息
    def get(self,request):
        flights = Flight.objects.all()
        flightList = []
        for flight in flights:
            flightObj = {
                'flightId': flight.flightId,
                'flightNumber': flight.flightNumber,
            }
            flightList.append(flightObj)
        return JsonResponse(flightList, safe=False)


class UpdateView(BaseView):  # Ajax方式航班信息更新
    def get(self, request, flightId):
        # GET方式请求查询航班信息对象并返回航班信息json格式
        flight = Flight.objects.get(flightId=flightId)
        return JsonResponse(flight.getJsonObj())

    def post(self, request, flightId):
        # POST方式提交航班信息修改信息更新到数据库
        flight = Flight.objects.get(flightId=flightId)
        flight.flightNumber = request.POST.get('flight.flightNumber')
        try:
            flightPhotoName = self.uploadImageFile(request, 'flight.flightPhoto')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        if flightPhotoName != 'img/NoImage.jpg':
            flight.flightPhoto = flightPhotoName
        flight.startStation = StationInfo.objects.get(stationId=request.POST.get('flight.startStation.stationId'))
        flight.endStation = StationInfo.objects.get(stationId=request.POST.get('flight.endStation.stationId'))
        flight.startTime = request.POST.get('flight.startTime')
        flight.endTime = request.POST.get('flight.endTime')
        flight.totalTime = request.POST.get('flight.totalTime')
        flight.seatType = SeatType.objects.get(seatTypeId=request.POST.get('flight.seatType.seatTypeId'))
        flight.price = float(request.POST.get('flight.price'))
        flight.seatNumber = int(request.POST.get('flight.seatNumber'))
        flight.leftSeatNumber = int(request.POST.get('flight.leftSeatNumber'))
        flight.flightDesc = request.POST.get('flight.flightDesc')
        flight.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台航班信息添加
    def get(self,request):
        seatTypes = SeatType.objects.all()  # 获取所有座位席别
        stationInfos = StationInfo.objects.all()  # 获取所有机场信息
        context = {
            'seatTypes': seatTypes,
            'stationInfos': stationInfos,
        }

        # 渲染显示模板界面
        return render(request, 'Flight/flight_add.html', context)

    def post(self, request):
        # POST方式处理图书添加业务
        flight = Flight() # 新建一个航班信息对象然后获取参数
        flight.flightNumber = request.POST.get('flight.flightNumber')
        try:
            flight.flightPhoto = self.uploadImageFile(request,'flight.flightPhoto')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        flight.startStation = StationInfo.objects.get(stationId=request.POST.get('flight.startStation.stationId'))
        flight.endStation = StationInfo.objects.get(stationId=request.POST.get('flight.endStation.stationId'))
        flight.startTime = request.POST.get('flight.startTime')
        flight.endTime = request.POST.get('flight.endTime')
        flight.totalTime = request.POST.get('flight.totalTime')
        flight.seatType = SeatType.objects.get(seatTypeId=request.POST.get('flight.seatType.seatTypeId'))
        flight.price = float(request.POST.get('flight.price'))
        flight.seatNumber = int(request.POST.get('flight.seatNumber'))
        flight.leftSeatNumber = int(request.POST.get('flight.leftSeatNumber'))
        flight.flightDesc = request.POST.get('flight.flightDesc')
        flight.save() # 保存航班信息信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新航班信息
    def get(self, request, flightId):
        context = {'flightId': flightId}
        return render(request, 'Flight/flight_modify.html', context)


class ListView(BaseView):  # 后台航班信息列表
    def get(self, request):
        # 使用模板
        return render(request, 'Flight/flight_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        flightNumber = self.getStrParam(request, 'flightNumber')
        startStation_stationId = self.getIntParam(request, 'startStation.stationId')
        endStation_stationId = self.getIntParam(request, 'endStation.stationId')
        startTime = self.getStrParam(request, 'startTime')
        endTime = self.getStrParam(request, 'endTime')
        seatType_seatTypeId = self.getIntParam(request, 'seatType.seatTypeId')
        # 然后条件组合查询过滤
        flights = Flight.objects.all()
        if flightNumber != '':
            flights = flights.filter(flightNumber__contains=flightNumber)
        if startStation_stationId != '0':
            flights = flights.filter(startStation=startStation_stationId)
        if endStation_stationId != '0':
            flights = flights.filter(endStation=endStation_stationId)
        if startTime != '':
            flights = flights.filter(startTime__contains=startTime)
        if endTime != '':
            flights = flights.filter(endTime__contains=endTime)
        if seatType_seatTypeId != '0':
            flights = flights.filter(seatType=seatType_seatTypeId)
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(flights, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        flights_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        flightList = []
        for flight in flights_page:
            flight = flight.getJsonObj()
            flightList.append(flight)
        # 构造模板页面需要的参数
        flight_res = {
            'rows': flightList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(flight_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除航班信息信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        flightIds = self.getStrParam(request, 'flightIds')
        flightIds = flightIds.split(',')
        count = 0
        try:
            for flightId in flightIds:
                Flight.objects.get(flightId=flightId).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出航班信息信息到excel并下载
    def get(self, request):
        # 收集查询参数
        flightNumber = self.getStrParam(request, 'flightNumber')
        startStation_stationId = self.getIntParam(request, 'startStation.stationId')
        endStation_stationId = self.getIntParam(request, 'endStation.stationId')
        startTime = self.getStrParam(request, 'startTime')
        endTime = self.getStrParam(request, 'endTime')
        seatType_seatTypeId = self.getIntParam(request, 'seatType.seatTypeId')
        # 然后条件组合查询过滤
        flights = Flight.objects.all()
        if flightNumber != '':
            flights = flights.filter(flightNumber__contains=flightNumber)
        if startStation_stationId != '0':
            flights = flights.filter(startStation=startStation_stationId)
        if endStation_stationId != '0':
            flights = flights.filter(endStation=endStation_stationId)
        if startTime != '':
            flights = flights.filter(startTime__contains=startTime)
        if endTime != '':
            flights = flights.filter(endTime__contains=endTime)
        if seatType_seatTypeId != '0':
            flights = flights.filter(seatType=seatType_seatTypeId)
        #将查询结果集转换成列表
        flightList = []
        for flight in flights:
            flight = flight.getJsonObj()
            flightList.append(flight)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(flightList)
        # 设置要导入到excel的列
        columns_map = {
            'flightNumber': '航班号',
            'startStation': '始发机场',
            'endStation': '终到机场',
            'startTime': '起飞时间',
            'endTime': '终到时间',
            'totalTime': '历时',
            'seatType': '席别',
            'price': '票价',
            'seatNumber': '总票数',
            'leftSeatNumber': '剩余票数',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'flights.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="flights.xlsx"'
        return response

