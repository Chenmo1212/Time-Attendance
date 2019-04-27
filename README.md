# Time-Attendance
### The First Commit
I just submitted what I have done before.
 
### The Second Commit
Small icons have been added to some menus.

### The Third Commit
Daily bug fixes.

### The fourth Commit
Change the suspension menu to right-click menu, and keep three menu modes: mouse suspension, left-click and right-click.
（将悬浮出现菜单改成右键出现菜单，并保留三种出现菜单方式——鼠标悬浮，鼠标左击，鼠标右击）

### 将前端的接口与样式结合
####发现bug：    

 ---
 前端： 
1. 在结束考勤的情况下无法再次更改考勤状态      
2. 开始签到页的输入框没有逻辑判断   
3. 当前考勤仅局限于从1开始的考勤，且不考虑是否有断号现象
4. 无法更改旷课信息
   
---
后端： 
1. 缺少当前未考勤学生信息   
2. 缺少总旷课次数   
3. 缺少总缺勤次数   
4. 缺少总考勤次数
5. 缺少旷课判断 

### Start checkin logic judgment(开始签到逻辑判断)
1. 增加开始签到界面的逻辑判断
2. 增加css样式使文字不可选中
