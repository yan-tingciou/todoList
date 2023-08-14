const container = document.querySelector(".container");
const add_Input = document.querySelector(".add_Input");
const btn_add = document.querySelector(".btn_add");
const list = document.querySelector(".list");
let item = [];
let undone_count = 0;

//儲存當下待辦事項，以便渲染進list
//每次新增或刪除完後重組li，data-num="${index}" 需要與刪除是同一個nodeName
//把function randerData()變成 const render = function (item)，這樣可以套入不同的參數xx.forEach
const render = (item) => {
  let new_item = "";
  item.forEach((i, index) => {
    new_item += `
    <li data-id="${i.num}">
      <label class="checkbox" for="" data-num="${index}">
        <input type="checkbox" class="check_cancel" ${i.checked}>
        <span>${i.content}</span>
      </label>
      <a href="#" class="delete" data-num="${index}"></a>
   </li>
    `;
  });
  list.innerHTML = new_item;
};

//可新增代辦事項
btn_add.addEventListener("click", (e) => {
  e.preventDefault();
  if (add_Input?.value.trim() == "") {
    alert("請填寫代辦事項");
    return;
  }
  undone_count++;
  let obj = {};
  obj.content = add_Input?.value.trim();
  obj.checked = "";
  obj.num = new Date().getTime();
  item.push(obj); //寫進item
  //跑render(item)，渲染進LI
  if (
    tab_all.getAttribute("class") == "active" ||
    tab_undone.getAttribute("class") == "active"
  ) {
    render(item);
  } else if (tab_done.getAttribute("class") == "active") {
    render(done_item);
  }
  add_Input.value = "";
});

//按enter可以新增一筆代辦事項，e.code改為e.key，使英文與數字鍵盤的 Enter 均納入監聽範圍
container.addEventListener("keyup", function (e) {
  if (e.key == "Enter") {
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
    //已完成並進行刪除時，會使 count 變為-1的程式碼調整，改成e.target為checked情況下才會--
    if (e.target.getAttribute("checked") === "checked") {
      undone_count--;
    }
    item.splice(num, 1);
  } else {
    //待辦事項會有狀態（完成與否），可透過 checkbox 來切換
    let id = parseInt(e.target.closest("li").dataset.id); //往上查找 只要找到符合條件的li 就停止，用dataset取出id的value，此id是抓取自[data-id="${i.num}]的id
    item.forEach((i) => {
      if (i.num === id) {
        //判斷當狀態為已完成，點完會變成待完成
        if (i.checked === "checked") {
          i.checked = "";
          undone_count++;
        } else {
          i.checked = "checked";
          undone_count--;
        }
      }
    });
  }
  render(item);
});

//全部、待完成、已完成套上active底線+切換時下方list正確顯示
const tab_list = document.querySelector(".tab");
const tab_all = tab_list.children[0];
const tab_undone = tab_list.children[1];
const tab_done = tab_list.children[2];
let undone_item = [];
let done_item = [];
let delete_item = [];

tab_list.addEventListener("click", (e) => {
  if (e.target == tab_undone) {
    tab_undone.setAttribute("class", "active");
    tab_all.className = "";
    tab_done.className = "";
    //下方切換清單顯示的部分整合進來
    undone_item = item.filter((i) => i.checked === "");
    render(undone_item);
  } else if (e.target == tab_done) {
    tab_undone.className = "";
    tab_all.className = "";
    tab_done.setAttribute("class", "active");
    //下方切換清單顯示的部分整合進來
    done_item = item.filter((i) => i.checked === "checked");
    render(done_item);
  } else if (e.target == tab_all) {
    tab_undone.className = "";
    tab_all.setAttribute("class", "active");
    tab_done.className = "";
    //下方切換清單顯示的部分整合進來
    render(item);
  }
});

//清除已完成功能及渲染在網頁上+
const deleteDoneItem = document.querySelector(".list_footer > a");
const card_list = document.querySelector(".card_list");

card_list.addEventListener("click", (e) => {
  if (e.target == deleteDoneItem) {
    e.preventDefault();
    delete_item = item.filter((i) => i.checked !== "checked");
    //先篩選出還沒checked的item存入新的arr，此arr為要保留顯示在LI的
    let new_item = "";
    delete_item.forEach((i, index) => {
      new_item += `
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
      tab_done.getAttribute("class") == "active"
    ) {
      list.innerHTML = "";
      item = delete_item;
    } else {
      list.innerHTML = new_item;
      item = delete_item; //由於切換已完成或新增時，被刪除的還是會出現，故要將item等於新的done_item
    }
  }
});

//X個待完成項目，在新增、取消勾選完成加上undone_count++，在按叉叉刪除、勾選完成加上undone_count--
const p = document.querySelector(".list_footer > p");
p.textContent = "0個待完成項目";
container.addEventListener("click", function () {
  p.textContent = `${undone_count}個待完成項目`;
});
render(item);