var cellData = {
    "Sheet1":{}
}
var previousSheet = 1;
var sheet = "Sheet1";
var defaultProperties = {
    "text":"",
    "font-weight":"",
    "font-style":"",
    "text-decoration":"",
    "text-align":"left",
    "background-color":"#ffffff",
    "color":"#000000",
    "font-family":"Noto Sans",
    "font-size":14
}


$(document).ready(function () {
    for (var i = 1; i <= 100; i++) {
        var n = i;
        var s = "";
        while (n != 0) {
            n = n - 1;
            s = String.fromCharCode(65 + n % 26) + s;
            n = Math.floor(n / 26);
        }
        let column = $(`<div class="column-name colId-${i}" id="colCod-${s}">${s}</div>`);
        $(".column-name-container").append(column);
        let row = $(`<div class="row-name" id="rowId-${i}">${i}</div>`);
        $(".row-name-container").append(row);
    }
    for(var i=1;i<=100;i++){
        var row = $(`<div class="row-cell">`);
        for(var j=1;j<=100;j++){
            let colId = $(`.colId-${j}`).attr("id").split("-")[1];
            let col = $(`<div class="input-cell col-${colId}" id="row-${i}-col-${j}"></div>`);
            $(row).append(col);
        }
        $(".input-cell-container").append(row);
    }

    $(".align-icon").click(function() { 
        $(".align-icon.selected").removeClass("selected");
        var val = $(this).attr("id");
        $(this).addClass("selected");
        findAndSetProperty(this,val);
    });
    $(".menu-icon.style-icon").click(function(){
        var val = $(this).hasClass("selected");
        findAndSetProperty(this,val);
        $(this).toggleClass("selected");
    });
    $(".input-cell").click(function(e) { 
        let [row,col] = getRowCol(this);
        if(e.ctrlKey==true){
            if($(`#row-${row-1}-col-${col}`).hasClass("selected")){
                $(`#row-${row-1}-col-${col}`).addClass("bottom-cell-selected");
                $(this).addClass("top-cell-selected");
            }
            if($(`#row-${row+1}-col-${col}`).hasClass("selected")){
                $(`#row-${row+1}-col-${col}`).addClass("top-cell-selected");
                $(this).addClass("bottom-cell-selected");
            }
            if($(`#row-${row}-col-${col-1}`).hasClass("selected")){
                $(`#row-${row}-col-${col-1}`).addClass("right-cell-selected");
                $(this).addClass("left-cell-selected");
            }
            if($(`#row-${row}-col-${col+1}`).hasClass("selected")){
                $(`#row-${row}-col-${col+1}`).addClass("left-cell-selected");
                $(this).addClass("right-cell-selected");
            }
        }else{
            $(".input-cell.selected").removeClass("selected");
            $(".input-cell").removeClass("top-cell-selected");
            $(".input-cell").removeClass("bottom-cell-selected");
            $(".input-cell").removeClass("left-cell-selected");
            $(".input-cell").removeClass("right-cell-selected");
        }
        $(this).addClass("selected");
        $('.input-cell').attr("contenteditable","false");
        let [r,c] = getRowCol(this);
        var data = defaultProperties;
        if(cellData[sheet][r] && cellData[sheet][r][c]){
            data = cellData[sheet][r][c];
        }
        setIcons(data);
    });
    $(document).on("blur",".input-cell.selected",function(){
        setProperty("text",$(this).text());
        console.log(cellData);
    });
    $(".input-cell").dblclick(function () {
        $(".input-cell.selected").removeClass("selected");
        $(this).addClass("selected");
        $(this).attr("contenteditable","true");
        $(this).focus();
    });
    $(".input-cell-container").scroll(function () { 
        $(".column-name-container").scrollLeft(this.scrollLeft);
        $(".row-name-container").scrollTop(this.scrollTop);
    });
    $(".bg-fill-icon").click(function() { 
        $("#bg-picker").click();
    });
    $(".text-fill-icon").click(function() { 
        $("#text-picker").click();
    });
    $("#text-picker").change(function(){
        setProperty("color",$(this).val());
    });
    $("#bg-picker").change(function(){
        setProperty("background-color",$(this).val());
    });
    $(".font-family-selector").change(function(){
        setProperty("font-family",$(this).val());
    });
    $(".font-size-selector").change(function(){
        var val = $(this).val()+"px";
        setProperty("font-size",val);
    });

    $(".icon-add").click(function(){
        emptySheet();
        var sheetName = "Sheet"+(previousSheet+1);
        sheet = sheetName;
        cellData[sheet] = {};
        $(".sheet-tab").removeClass("selected");
        $(".sheet-tab-container").append(`<div class="sheet-tab selected" id="${sheetName}">${sheetName}</div>`);
        previousSheet=previousSheet+1;
        setDefault();
        // $(".sheet-tab.selected").click(function(){
        //     console.log("clicked");
        //     if(!$(this).hasClass("selected")){
        //         $(".sheet-tab").removeClass("selected");
        //         $(this).addClass("selected");
        //         emptySheet();
        //         sheet = $(this).text();
        //         console.log($(this).text());
        //         loadSheet($(this).text());
        //     }
        // });
        addSheetEvents();
    });

    $(".container").click(function(){
        $(".sheet-bar-options").remove();
    });

    function addSheetEvents(){
        $(".sheet-tab").click(function(){
            if(!$(this).hasClass("selected")){
                $(".sheet-tab").removeClass("selected");
                $(this).addClass("selected");
                emptySheet();
                sheet = $(this).text();
                console.log($(this).text());
                loadSheet($(this).text());
            }
        });
        $(".sheet-tab").contextmenu(function(e){
            e.preventDefault();
            if($(this).hasClass("selected")){
            $(".container").append(`<div class="sheet-bar-options">
                                        <div class="delete-sheet">Delete</div>
                                        <div class="rename-sheet">Rename</div>
                                    </div>`);
                                    $(".rename-sheet").click(function(){
                                        console.log("button clicked");
                                        $(".container").append(`<div class="rename-display">
                                                                    <div class="rename-input">
                                                                        <input type="text" class="new-name" placeholder="Enter new Sheet name">
                                                                    </div>
                                                                    <div class="rename-response">
                                                                        <div class="cancel">Cancel</div>
                                                                        <div class="apply">Apply</div>
                                                                    </div>
                                                                </div>`);
                                                                $(".cancel").click(function(){
                                                                    $(".rename-display").remove();
                                                                });
                                                                $(".apply").click(function(){
                                                                    var val = $(".new-name").val();
                                                                    changeSheetName(val);
                                                                    $(".rename-display").remove();
                                                                });
                                    });
                                    $(".delete-sheet").click(function(){
                                        if(Object.keys(cellData).length>1){
                                            emptySheet();
                                            $(".sheet-tab.selected").remove();
                                            delete cellData[sheet];
                                            sheet = Object.keys(cellData)[0];
                                            $(`.sheet-tab#${sheet}`).addClass("selected");
                                            loadSheet(sheet);
                                        }
                                    })
            $(".sheet-bar-options").css("left",e.pageX);
                                }
        });
    }
    addSheetEvents();

    function getRowCol(ele){
        var array = $(ele).attr("id").split("-");
        let row = parseInt(array[1]);
        let col = parseInt(array[3]);
        return [row,col];
    }

    function findAndSetProperty(ele,val) {
        var property = "";
        var value = "";
        if($(ele).hasClass("align-icon")){
            property = "text-align";
            value = val;
        }else if($(ele).hasClass("icon-bold")){
            if(val==false) value = "bold";
            property = "font-weight";
        }else if($(ele).hasClass("icon-italic")){
            if(val==false) value = "italic";
            property = "font-style";
        }else if($(ele).hasClass("icon-underline")){
            if(val==false) value = "underline";
            property = "text-decoration";
        }
        setProperty(property,value);
    }

    function setProperty(property,value) {
        $(".input-cell.selected").each(function () {
            let [row,col] = getRowCol(this);
            if(cellData[sheet][row] && cellData[sheet][row][col]){
                cellData[sheet][row][col][property] = value;
            }else if(cellData[sheet][row]){
                cellData[sheet][row][col] = {...defaultProperties};
                cellData[sheet][row][col][property] = value;
            }else{
                cellData[sheet][row] = {};
                cellData[sheet][row][col] = {...defaultProperties};
                cellData[sheet][row][col][property] = value;
            }
            if(JSON.stringify(cellData[sheet][row][col])==JSON.stringify(defaultProperties)){
                delete cellData[sheet][row][col];
                if(Object.keys(cellData[sheet][row]).length==0)
                    delete cellData[sheet][row];
            }
            $(this).css(property,value);
            console.log(cellData);
        });
    }    

    function setIcons(data) {
        $(".align-icon").removeClass("selected");
        $(`.align-icon#${data["text-align"]}`).addClass("selected");
        if(data["text-decoration"]=="underline") $(".icon-underline").addClass("selected");
        else $(".icon-underline").removeClass("selected");
        if(data["font-style"]=="italic") $(".icon-italic").addClass("selected");
        else $(".icon-italic").removeClass("selected");
        if(data["font-weight"]=="bold") $(".icon-bold").addClass("selected");
        else $(".icon-bold").removeClass("selected");
        $("#bg-picker").val(data["background-color"]);
        $("#text-picker").val(data["color"]);
        $(".font-size-selector").val(parseInt(data["font-size"]));
        $(".font-family-selector").val(data["font-family"]);
    }


    function emptySheet(){
        let sheetInfo = cellData[sheet];
        for(let i of Object.keys(sheetInfo)){
            for(let j of Object.keys(sheetInfo[i])){
                $(`#row-${i}-col-${j}`).text("");
                $(`#row-${i}-col-${j}`).css("font-weight","");
                $(`#row-${i}-col-${j}`).css("font-style","");
                $(`#row-${i}-col-${j}`).css("text-decoration","");
                $(`#row-${i}-col-${j}`).css("text-align","left");
                $(`#row-${i}-col-${j}`).css("background-color","#ffffff");
                $(`#row-${i}-col-${j}`).css("color","#000000");
                $(`#row-${i}-col-${j}`).css("font-family","Noto Sans");
                $(`#row-${i}-col-${j}`).css("font-size",14);
            }
        }    
    }

    function loadSheet(st){
        let sheetInfo = cellData[st];
        for(let i of Object.keys(sheetInfo)){
            for(let j of Object.keys(sheetInfo[i])){
                let val = sheetInfo[i][j];
                $(`#row-${i}-col-${j}`).text(val["text"]);
                $(`#row-${i}-col-${j}`).css("font-weight",val["font-weight"]);
                $(`#row-${i}-col-${j}`).css("font-style",val["font-style"]);
                $(`#row-${i}-col-${j}`).css("text-decoration",val["text-decoration"]);
                $(`#row-${i}-col-${j}`).css("text-align",val["text-align"]);
                $(`#row-${i}-col-${j}`).css("background-color",val["background-color"]);
                $(`#row-${i}-col-${j}`).css("color",val["color"]);
                $(`#row-${i}-col-${j}`).css("font-family",val["font-family"]);
                $(`#row-${i}-col-${j}`).css("font-size",val["font-size"]);
            }
        } 
        setDefault();
    }

    function setDefault(){
        let [row,col]=[1,1];
        if($(".input-cell").hasClass("selected")) [row,col] = getRowCol($(".input-cell.selected"));
        else $(`.input-cell#row-${row}-col-${col}`).addClass("selected");
        if(cellData[sheet][row] && cellData[sheet][row][col]){
            setIcons(cellData[sheet][row][col]);
        }else{
            $(".align-icon").removeClass("selected");
            $(`.align-icon#left`).addClass("selected");
            $(".icon-underline").removeClass("selected");
            $(".icon-italic").removeClass("selected");
            $(".icon-bold").removeClass("selected");
            $("#bg-picker").val(defaultProperties["background-color"]);
            $("#text-picker").val(defaultProperties["color"]);
            $(".font-size-selector").val(parseInt(defaultProperties["font-size"]));
            $(".font-family-selector").val(defaultProperties["font-family"]);
        }
    }

    function changeSheetName(new_name){
        $(".sheet-tab.selected").text(new_name);
        $(".sheet-tab.selected").attr("id",new_name);
        cellData[new_name] = cellData[sheet];
        delete cellData[sheet];
        console.log(cellData);
        sheet = new_name;
    }
});
