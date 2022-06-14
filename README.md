# Ajia-Paper2PDF

- 主要解决，HTML生成PDF，分页可控的问题
- 依赖js库：polyfill、jquery、lodash、bookjs-eazy

### 优势：
- 只需专注用H5构件你的PDF内容,而无需关心分页及内容截断问题
- 支持预览、WEB打印、页码/目录、自定义页眉页脚。
- 前后端皆可生成PDF,前端打印另存为PDF,后端可配套使用chrome headless和wkhtmltopdf命令行PDF生成工具。
- docker镜像。可快速构件你的在线PDF的打印生成服务
- 兼容主流浏览器及移动端

### 缺陷提示：
- 不支持现代js框架 VUE、React等单页面多路由场景
- 不支持动态刷新，重新渲染需要刷新整个页面
- PDF页面需要单独的html文件入口
- 如果想嵌入应用网页内部，可使用iframe方式

## 使用方式
渲染机制：
程序会检查全局变量window.bookConfig.start 的值。
直到此值为true时，才开始渲染将 #content-box 节点的内容渲染为PDF样式。
重要：如果你的页面是动态的，就先将默认值设为false,当内容准备好后，在将其设为true，
高度页面溢出检测原理：
页面内容节点.nop-page-content，是一个弹性高度的容器节点。
在向页面加入内容时会引起容器节点的高度变化。
计算页面的是否溢出，就时通过计算它高度得到的。
注意： 
1. display: float, position: absolute; overflow样式的元素的插入不会页面容器高度变化。可能造成页面溢出而检测不到。
2. 因为 margin样式的元素 无法撑开.nop-page-content 大小,造成.nop-page-content位置偏移，很容易造成页面出现溢出的现象，所以控制相对位置尽量使用padding

## 配置
<pre><code type="js">
bookConfig = {
    /**  全部纸张类型，未全量测试，常用ISO_A4
    ISO_A0、ISO_A1、ISO_A2、ISO_A3、ISO_A4、ISO_A5
    ISO_B0、ISO_B1、ISO_B2、ISO_B3、ISO_B4、ISO_B5、ISO_B6、ISO_B7、ISO_B8、ISO_B9、ISO_B10
    ISO_C0、ISO_C1、ISO_C2、ISO_C3、ISO_C4、ISO_C5、ISO_C6、ISO_C7、ISO_DL、ISO_C7_6
    JIS_B0、JIS_B1、JIS_B2、JIS_B3、JIS_B4、JIS_B5、JIS_B6、JIS_B7、JIS_B8、JIS_B9
    NA_LEGAL、NA_LETTER、NA_LEDGER、NA_EXECUTIVE、NA_INVOICE、
    BIG_K32
    **/
    // 定义纸张大小,两种方式,可选，默认：ISO_A4
    pageSize : 'ISO_A4', 
    orientation :  'landscape', // portrait/landscape 定义纸张是竖屏/横屏放置
    /** pageSizeConfig 和 pageSize/orientation组合 ，只选其一即可 **/
    pageSizeOption : {
        width : '15cm', // 自定义宽高
        height : '20cm',
    }

    // 可选，边距，所列选项为默认值
    padding : "31.8mm 25.4mm 31.8mm 25.4mm", 
    // 可选，强制打印背景页，所列选项为默认值
    forcePrintBackground : true,
    // 可选，文本内容在跨页差分时，不会出现在段首的字符，所列选项为默认值
    textNoBreakChars : ['，','。','：','”','！','？','、','；','》','】','…','.',',','!',']','}','｝'],
    // 可选，毫秒，生成PDF延时时间，（此配置项不影响预览）。有些页面包含一些异步不可控因素。调整此值保证页面打印正常。可以适当调节此值以优化服务端生成PDF的速度
    printDelay : 1000, 

    // 简易页码插件，可选（默认未开启），所列选项为开启时的默认值
    simplePageNum : {
        // 从第几页开始编号，默认0为第一页开始，，没有页码,也可以为一个css选择器如：".first_page"，从包含选择器接点的页面开始编号
        pageBegin : 0, 
        // 从第几页结束编号，默认-1为最后一页结束，，没有页码,也可以为一个css选择器如：".end_page"，到包含选择器接点的页面结束编号
        pageEnd : -1,
        // 页面部件， 可选
        pendant : '<div class="page-num-simple"><span style="">${PAGE} / ${TOTAL_PAGE}</span></div>',
    }, 

    // 目录插件，可选（默认未开启），所列选项为开启时的默认值
    simpleCatalog : {
        titlesSelector : 'h1,h2,h3,h4,h5,h6', // 可选，作为目录标题的选择器，按目录级别依次

        
        /** 目录相关选项 **/
        showCatalog : true, // 可选，是否在页面中插入目录，默认，插入目录到页面
        header : '<div class="catalog-title">目 录</div>', // 可选，目录页Header部分，放入你想加入的一切
        itemFillChar : '…', // 可选，目录项填充字符, ""空字符串，不填充，使用自定义makeItem时，忽略该选项配置
        positionSelector : '.nop-page-item-pagenum-1', //可选，目录位置会插入在匹配页的之前，默认为第一个编号页前
        // 可选，自定义目录项。
        makeItem : function(itemEl,itemInfo) {
           /** 
            * @var itemEl jQuery Element 
            * @var object itemInfo PS: {title, pageNum, level,linkId}
            **/
            return '<div>自定义的目录项html内容，根据itemInfo自己构造</div>';
        },

        /** 侧边栏相关选项 **/
        showSlide : true, // 可选，是否显示侧边栏，目录导航，工具栏按钮顺序index: 200
        slideOn : false, // 可选，目录导航，默认是否打开状态
        slideHeader : '<div class="title">目&nbsp;&nbsp;录</div>', // 可选，侧边栏标题
        slideClassName : '', // 可选，侧边栏自定义class
        slidePosition : 'left', // 可选，位置 left、right
        slideMakeContent : null, // 自定义侧边栏内容处理函数，为null时,默认行为：使用目录内容填充， function(){ return '侧边栏内容';}
    },

    // 工具栏插件，可选（默认开启），所列选项为开启时的默认值
    toolBar : {
        // Web打印按钮功能可选，默认true, 按钮顺序index: 100
        webPrint : true, 

        /**
         * HTML保存按钮，可选，bool|object，默认false:禁用保存HTML功能，true:启用并使用默认选项
         * 按钮顺序index: 300
         * saveHtml : {
         *     // 可选，保存的文件名，默认值: document.title + '.html'
         *     fileName : 'output.html',
         *     // 可选，自定义下载保存。可用于混合APP内下载时用
         *     save : function(getStaticHtmlPromiseFunc,fileName){
         *         getStaticHtmlPromiseFunc().then(function(htmlBlob){
         *             ...
         *         })
         *     }
         * }
         */
        saveHtml : false,

        /**
         * 服务端打印下载按钮，按钮顺序index: 400
         * 可选，bool|object，默认false:不启用,true:启用并使用默认选项,object:使用自定义的服务端打印
         * true等效的object的配置：serverPrint : { serverUrl : '/' }, 
         * 官网可用serverUrl : '//bookjs.zhouwuxue.com/'
         * 要使用serverPrint,必须server能访问到你的网页。网页不要使用登录状态授权，建议通过URL参数传递临时授权
         * 如果使用官方的server进行打印，则需公网上可正确访问你用bookjs-eazy构造的网页
         * 
         * serverPrint : {
         *     // 可选，打印服务器地址,按钮顺序index: 400
         *     serverUrl : '/',
         *     // 可选，true时使用wkHtmlPdf制作，false：默认使用chrome headless
         *     wkHtmlToPdf : false, 
         *     // 可选，保存的文件名，默认值 document.title + '.pdf'
         *     fileName : 'output.pdf',
         *     // 可选，打印附属参数
         *     params : {
         *         // 打印超时时间
         *         timeout : 30000,
         *         // 页面渲染完成后，打印前延时
         *         delay : 1000,
         *     }, 
         *     // 可选，自定义下载。可用于混合APP内下载时用
         *     save : function(pdfUrl, serverPrintOption){
         *         
         *     }
         * }
         */
        serverPrint : false,
        
        buttons : [
            // 这里可以自定义工具栏按钮
            // {
            //    id : 'cloudPrint',
            //    index : 1, // 按钮位置顺序，小的显示在前面，系统内置按钮index值，见各配置项说明。
            //    icon : 'https://xxxx.../aa.png'
            //    onClick : function(){ console.log("...do some thing"); }
            // }
        ],

        className: '', // 额外自定义的class属性
        position : 'right',// 位置：right、left
    },
    
    // 重要
    // 当这个值为true时，页面才开始渲染。如果你的页面是动态的，
    // 就先将默认值设为false,当下节所述中的#content-box节点内容准备好后，在将其设为true，
    // bookConfig.start = true;
    start : true,
}
</code></pre>

### PDF 内容设计
- 定义一个id为content-box节点内放入要插入到文档里的内容；
- content-box下的每个节点（指的是一级子节点）都需定义属性 data-op-type,表示其在文档中的插入方式 其值含义如下：
<pre><code>
block （常用）: 块：（默认）如果当前页空间充足则整体插入，空间不足，则会整体插入到下一页
    注意：这里的块,仅是内容不跨页。与css中的display无关，也就可以display: inline样式。
    前面有用户问到这个问题。从而限制了他对PDF内容设计的思维。
    例如：<div data-op-type="block">...</div>
    * 使用在符合下列选择器规则的位置之一：
        #content-box> 下的一级节点
        [data-op-type=mix-box] .nop-fill-box>  混合盒子容器节点下的一级节点
        [data-op-type=table] tbody td> 表格的单元格的一级节点

text : 文本，跨页内容自动分割,节点内直接放入文本内容。(内部只能为文本，如果包含子节点，子节点标签将被删除)
    例如：<p data-op-type="text"> long text...</p>
    * 使用在符合下列选择器规则的位置之一：
        #content-box> 下的一级节点
        [data-op-type=mix-box] .nop-fill-box>  混合盒子容器节点下的一级节点
        [data-op-type=table] tbody td> 表格的单元格的一级节点


new-page : 标记从新页开始插入
    * 使用在符合下列选择器规则的位置之一： 
        #content-box> 下的一级节点
        [data-op-type=mix-box] .nop-fill-box>  混合盒子容器节点下的一级节点
        [data-op-type=table] tbody>tr  表格的tbody下的tr节点,(与被标记到其他位置不同，被标记的tr节点会保留不会从页面删除)

pendants : 页面部件列表（页眉/页脚/页标签/水印背景等）
    部件：pendants内部的子节点，会自动标记class:nop-page-pendants，在其定义后的每个页面都会显示，直到下一个pendants出现。
    部件nop-page-pendants包含css: {position: absolute}属性，相对页面纸张位置固定。
    在页面设计时需要为部件节点设置css: left/right/top/bottom/width/height等属性来控制部件位置和大小。
    * 使用在符合下列选择器规则的位置之一： 
        #content-box> 下的一级节点

mix-box（常用） : 混合盒子：盒子内部class:nop-fill-box标记的节点的可以包含多个[data-op-type="text"],[data-op-type="block"]元素
     盒子内的元素被超出一页时，会根据text/block的规则，自动分割到下一页，并会复制携带包裹元素的外部节点。
     容器节点内的一级节点必须标记data-op-type属性，属性值： text或block
     text:允许跨页截断
     block:（默认）不可跨页截断
     * 使用在符合下列选择器规则的位置之一： 
             #content-box> 下的一级节点

     例如：下面的一段HTML，包含很长的内容，多到会超出几页的长度，那么bookjs-eazy会对其自动分页将会
            
    <div data-op-type="mix-box"><!-- 跨页时：这个节点会被复制到下一页，除nop-fill-box内所有的内容都会被复用,一个data-op-type里只可以有一个容器节点（class:nop-fill-box）,容器节点可以在data-op-type="mix-box"里的任意位置 -->
        <div class="title">布局1</div>
        <div class="nop-fill-box">
            <!-- 跨页时，class: nop-fill-box 里的内容会接着上一页页继续填充 -->
            <span data-op-type="text">AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</span>
            <span data-op-type="new-page"></span><!-- 插入新页 -->
            <span data-op-type="text" sytle="color:red">BBBBBBBBBBBBBBBBBBBBBBB</span>
            <a data-op-type="text" target="_blank" href="https://baijiahao.baidu.com/s?id=1726750581584920901&wfr=spider&for=pc">文章链接...</a><!-- 这里的链接文字：如果跨页最两页里都会有超链接 -->
        </div>
        <div class="title">布局2</div>
        <div class="title">布局3</div>
    </div>

table : 对表格遇到分页时，出现的一些显示问题，做了些优化处理（注意：列一定要固定宽度），（参考：ezay-6 示例）
    对于合并单元格：td上标记属性 data-split-repeat="true" ，在分页td里的文本会在在新页中也会显示。
    td : 内部不要直接使用文本，用标签包裹，直接子td>节点可以是[data-op-type="text"],[data-op-type="block"]元素，(相当于mix-box的.nop-fill-box )
         text:允许跨页截断
         block:（默认）不可跨页截断

block-box : 块盒子（@deprecated 其功能已完全被mix-box替代）：块盒子内部nop-fill-box标记的节点包含的多个块，盒子内的多个块被分割到多个页面时，都会复制包裹块的外部节点。
    以下一个示例中的表格为例：
    table节点定义为块盒子
    tbody节点定义为容纳块的容器节点（使用class: nop-fill-box标记）
    这样在填充行tr时，当前页空间不足时，换页并复制外部table（除去nop-fill-box标记的部分）继续填充。这样表头就得到复用

text-box : 文本盒子（@deprecated 其功能已完全被mix-box替代）：与块盒子类似，大文本内容跨多个页面时，会复制外部包裹文本的盒子的部分。
     文本盒子节点， 大文本的容器节点需用 class : nop-fill-box标记
</code></pre>

- 注意：block-box、text-box、mix-box到.nop-fill-box直接的元素不可以设置height、max-height样式，会影响页面溢出检测

<hr/>
原工程地址：<a href="https://gitee.com/wuxue107/bookjs-eazy">点击跳转</a>