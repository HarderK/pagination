# pagination
分页
- 里面用到了模板字符串，需要替换

```
 page.init(url, totalNum, pageSize, {first: true, last:true, go: true}, {prev: "<", next: ">"});
 page.pageList(1);		// 当前为第一页
```
- 初始化需要传入三个必须参数，url：请求的url地址,totalNum：总数据条数, pageSize: 每页的数据条数