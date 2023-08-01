const container = document.querySelector(".container");
const addList = document.querySelectorAll("input")[0];
addList.classList = "add_Input";
const add_Input = document.querySelector(".add_Input");
const btn_add = document.querySelector(".btn_add");
const list = document.querySelector(".list");
let item = [];
let count = 0;

//儲存當下待辦事項，以便渲染進list
//每次新增或刪除完後重組li，data-num="${index}" 需要與刪除是同一個nodeName
//把function randerData()變成 const render = function (item)，這樣可以套入不同的參數xx.forEach
const render = (item) => {
  let newItem = "";
  item.forEach((i, index) => {
    newItem += `
    <li data-id="${i.num}">
      <label class="checkbox" for="" data-num="${index}">
        <input type="checkbox" class="check_cancel" ${i.checked}>
        <span>${i.content}</span>
      </label>
      <a href="#" class="delete" data-num="${index}"></a>
   </li>
    `;
  });
  list.innerHTML = newItem;
};

//可新增代辦事項
btn_add.addEventListener("click", (e) => {
  if (add_Input.value.trim() == "") {
    alert("請填寫代辦事項");
    return;
  }
  count++;
  let obj = {};
  obj.content = add_Input.value.trim();
  obj.checked = "";
  obj.num = new Date().getTime();
  item.push(obj); //寫進item
  //跑render(item)，渲染進LI
  if (
    tab_first.getAttribute("class") == "active" ||
    tab_second.getAttribute("class") == "active"
  ) {
    render(item);
  } else if (tab_last.getAttribute("class") == "active") {
    render(doneItem);
  }
  add_Input.value = "";
});

//按enter可以新增一筆代辦事項
container.addEventListener("keyup",function(e){
  if(e.code == "Enter"){
    btn_add.click();
  }
});

//可刪除代辦事項
const checkBox = document.querySelector(".checkbox");
const checkbox_Id = document.querySelector("#checkbox_Id");

list.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.getAttribute("class") == "delete") {
    let num = e.target.getAttribute("data-num"); //需要與刪除是同一個nodeName
    item.splice(num, 1);
    count--;
  } else {
    //待辦事項會有狀態（完成與否），可透過 checkbox 來切換
    let id = parseInt(e.target.closest("li").dataset.id); //往上查找 只要找到符合條件的li 就停止，用dataset取出id的value，此id是抓取自[data-id="${i.num}]的id
    item.forEach((i) => {
      if (i.num === id) {
        //判斷當狀態為已完成，點完會變成待完成
        if (i.checked === "checked") {
          i.checked = "";
          count++;
        } else {
          i.checked = "checked";
          count--;
        }
      }
    });
  }
  render(item);
});

//全部、待完成、已完成套上active底線
const tab = document.querySelector(".tab");
const tab_first = document.querySelector(".active");
const tab_second = document.querySelector(".tab").children[1];
const tab_last = document.querySelector(".tab").lastElementChild;

tab.style.cursor = "pointer";
tab.addEventListener("click", (e) => {
  if (e.target == tab_second) {
    tab_second.setAttribute("class", "active");
    tab_first.className = "";
    tab_last.className = "";
  } else if (e.target == tab_last) {
    tab_second.className = "";
    tab_first.className = "";
    tab_last.setAttribute("class", "active");
  } else if (e.target == tab_first) {
    tab_second.className = "";
    tab_first.setAttribute("class", "active");
    tab_last.className = "";
  }
});

//點擊切換全部、待完成、已完成，下方list正確顯示
let undoItem = [];
let doneItem = [];
let deleteItem = [];

const cancelDoneItem = document.querySelector(".list_footer > a");

const card_list = document.querySelector(".card_list");
card_list.addEventListener("click", (e) => {
  if (
    e.target.textContent === "待完成" ||
    tab_second.getAttribute("class") == "active"
  ) {
    undoItem = item.filter((i) => i.checked === "");
    render(undoItem);
  }
  if (
    e.target.textContent === "已完成" ||
    tab_last.getAttribute("class") == "active"
  ) {
    doneItem = item.filter((i) => i.checked === "checked");
    render(doneItem);
  }
  if (e.target.textContent === "全部") {
    render(item);
  }
  if (e.target == cancelDoneItem) {
    //清除全部已完成功能。
    e.preventDefault();
    deleteItem = item.filter((i) => i.checked !== "checked");
    //先篩選出還沒checked的item存入新的arr，此arr為要保留顯示在LI的
    let newItem = "";
    deleteItem.forEach((i, index) => {
      newItem += `
    <li data-id="${i.num}">
      <label class="checkbox" for="" data-num="${index}">
      <input type="checkbox" class="check_cancel" ${i.checked}>
      <span>${i.content}</span>
      </label>
      <a href="#" class="delete" data-num="${index}"></a>
    </li>
   `;
    });
    if (
      e.target.textContent === "已完成" ||
      tab_last.getAttribute("class") == "active"
    ) {
      list.innerHTML = "";
      item = deleteItem;
    } else {
      list.innerHTML = newItem;
      item = deleteItem; //由於切換已完成或新增時，被刪除的還是會出現，故要將item等於新的doneItem
    }
  }
});

//X個待完成項目，在新增、取消勾選完成加上count++，在按叉叉刪除、勾選完成加上count--
const p = document.querySelector(".list_footer > p");
p.textContent = "0個待完成項目";
container.addEventListener("click", function () {
  p.textContent = `${count}個待完成項目`;
});

render(item);