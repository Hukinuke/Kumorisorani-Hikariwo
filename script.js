let organizations = {};

let characters = [];

let currentEra = "present";

let selectedOrganization = null;

let selectedGrade = null;

let selectedGroup = null;

let currentCharacter = null;

window.onload = loadData;

/* ------------------
   共通セクション生成
------------------- */

function createListSection(
    title,
    items
){

    if(
        !items ||
        items.length === 0
    ){
        return "";
    }

    return `

    <div class="card">

        <h3 class="section-title">

            ${title}

        </h3>

        <ul class="character-list">

            ${
                items
                .map(
                    item =>
                    `<li>${item}</li>`
                )
                .join("")
            }

        </ul>

    </div>

    `;
}

/* ------------------
   データ読み込み
------------------- */

async function loadData(){

    const response =
        await fetch("characters.json");

    characters =
        await response.json();

    organizations = {

        "未来高校":{
            description:
            "物語の主な舞台となる学校。"
        },

        "お助け部":{
            description:
            "困っている人を助けるための部活動。"
        },

        "生徒会":{
            description:
            "学校運営を担う組織。"
        }

    };

    createOrganizations();

    renderWorld();

    renderTimeline();
}

function showPage(id){

    document
        .querySelectorAll(".page")
        .forEach(page=>{
            page.classList.remove("active");
        });

    document
        .getElementById(id)
        .classList.add("active");
}

function setEra(era){

    currentEra = era;

    const labels = {
        past:"過去編",
        present:"現在編",
        future:"未来編"
    };

    document
        .getElementById("eraLabel")
        .textContent =
        labels[era] + " を表示中";

    createOrganizations();

    renderWorld();

    renderTimeline();

    if(currentCharacter){

        openCharacter(
            currentCharacter
        );

    }else{

        backToGroups();

    }
}

/* ------------------
   世界観
------------------- */

function renderWorld(){

    const data = {

        past:
        "過去編の世界観を書いてください",

        present:
        "現在編の世界観を書いてください",

        future:
        "未来編の世界観を書いてください"

    };

    document
        .getElementById("worldContent")
        .innerHTML =
        `<p>${data[currentEra]}</p>`;
}

/* ------------------
   年表
------------------- */

function renderTimeline(){

    const timeline = {

        past:[
            "過去の出来事"
        ],

        present:[
            "過去の出来事",
            "現在編開始"
        ],

        future:[
            "過去の出来事",
            "現在編開始",
            "未来の出来事"
        ]
    };

    document
        .getElementById("timelineContent")
        .innerHTML =
        timeline[currentEra]
        .map(item=>
            `<p>・${item}</p>`
        )
        .join("");
}

/* ------------------
   組織・用語集
------------------- */

function openTerm(name){

    showPage("terms");

    const term =
        organizations[name];

    if(!term){
        return;
    }

    const members =
        characters.filter(character => {

            const info =
                character[currentEra];

            return (
                info.organization === name ||
                info.group === name
            );

        });

    document
        .getElementById("termsContent")
        .innerHTML = `

<div class="breadcrumb">

${name}

</div>

<h2>${name}</h2>

<p>
${term.description}
</p>

<h3>
所属キャラクター
</h3>

${members.map(member => `

<div
class="relation-button"
onclick="
showPage('characters');
openCharacter('${member.id}');
">

${member.name}

</div>

`).join("")}

`;
}

function createOrganizations(){

    const organizations = [

        ...new Set(

            characters.map(
                c =>
                c[currentEra]
                .organization
            )

        )

    ];

    const container =
        document.getElementById(
            "groupList"
        );

    container.innerHTML = "";

    organizations.forEach(org=>{

        const div =
            document.createElement("div");

        div.className =
            "card-button";

        div.innerHTML =
        `<h3>${org}</h3>`;

        div.onclick =
        ()=>openOrganization(org);

        container.appendChild(div);

    });

}

function openOrganization(org){

    selectedOrganization = org;

    const grades = [

        ...new Set(

            characters

            .filter(
                c =>
                c[currentEra]
                .organization
                === org
            )

            .map(
                c =>
                c[currentEra]
                .grade
            )

        )

    ];

    document
        .getElementById("characterDetailView")
        .hidden = true;

    document
        .getElementById("groupView")
        .hidden = true;

    document
        .getElementById("characterListView")
        .hidden = false;

    document
    .getElementById("currentGroup")
    .innerHTML = `

    <div class="breadcrumb">

    <span onclick="backToGroups()">

    グループ一覧

    </span>

    ＞

    ${org}

    </div>

    <h2>${org}</h2>

    `;


    const container =
        document
        .getElementById(
            "characterList"
        );

    container.innerHTML = "";

    grades.forEach(grade=>{

        const div =
            document.createElement("div");

        div.className =
            "card-button";

        div.innerHTML =
        `<h3>${grade}</h3>`;

        div.onclick =
        ()=>openGrade(grade);

        container.appendChild(div);

    });
}

function openGrade(grade){

    console.log(
        "selectedOrganization:",
        selectedOrganization
    );

    console.log(
        "grade:",
        grade
    );

    selectedGrade = grade;

    const groups = [

        ...new Set(

            characters

            .filter(
                c =>

                c[currentEra]
                .organization
                === selectedOrganization

                &&

                c[currentEra]
                .grade
                === grade

            )

            .map(
                c =>
                c[currentEra]
                .group
            )

        )

    ];

    console.log(
        "groups",
        groups
    );

    document
        .getElementById("characterDetailView")
        .hidden = true;

    document
    .getElementById(
        "characterListView"
    )
    .hidden = false;

    console.log(
        "characterListView",
        document.getElementById(
            "characterListView"
        ).hidden
    );

    document
    .getElementById(
        "currentGroup"
    )
    .innerHTML = `

<div class="breadcrumb">

<span
onclick="
openOrganization(
'${selectedOrganization}'
)">
<div class="breadcrumb">

<span onclick="backToGroups()">

グループ一覧

</span>

＞

<span
onclick="
openOrganization(
'${selectedOrganization}'
)">
${selectedOrganization}
</span>

＞

${grade}

</div>

<h2>${grade}</h2>

`;

    const container =
        document
        .getElementById(
            "characterList"
        );

    container.innerHTML = "";

    groups.forEach(group=>{

        const div =
            document.createElement("div");

        div.className =
            "card-button";

        div.innerHTML =
        `<h3>${group}</h3>`;

        div.onclick =
        ()=>openGroup(group);

        container.appendChild(div);

    });

}

/* ------------------
   グループを開く
------------------- */

function openGroup(group){

    selectedGroup = group;

    document
    .getElementById(
        "characterDetailView"
    )
    .hidden = true;

    document
        .getElementById("groupView")
        .hidden = true;

    document
        .getElementById("characterListView")
        .hidden = false;

    document
    .getElementById(
        "currentGroup"
    )
    .innerHTML = `

<div class="breadcrumb">

<span
onclick="backToGroups()">
グループ一覧
</span>

＞

<span
onclick="
openOrganization(
'${selectedOrganization}'
)">
${selectedOrganization}
</span>

＞

<span
onclick="
openGrade(
'${selectedGrade}'
)">
${selectedGrade}
</span>

＞

${group}

</div>

<h2>${group}</h2>

`;

    const container =
        document.getElementById(
            "characterList"
        );

    container.innerHTML = "";

    characters
        .filter(
        c =>

        c[currentEra]
        .organization
        === selectedOrganization

        &&

        c[currentEra]
        .grade
        === selectedGrade

        &&

        c[currentEra]
        .group
        === group

        )
        .forEach(char=>{

            const info =
                char[currentEra];

            const div =
                document.createElement("div");

            div.className =
                "card-button";

            div.style.borderLeft =
                `6px solid ${info.color}`;

            div.innerHTML = `

                <div
                style="
                width:18px;
                height:18px;
                border-radius:50%;
                background:${info.color};
                margin-bottom:10px;
                ">
                </div>

                <h3>${char.name}</h3>

                <p>${info.role}</p>

            `;

            div.onclick =
                ()=>openCharacter(char.id);

            container.appendChild(div);
        });
}

/* ------------------
   キャラ詳細
------------------- */

function openCharacter(id){

    currentCharacter = id;

    const char =
        characters.find(
            c => c.id === id
        );

    const info =
        char[currentEra];

    document
        .getElementById("characterListView")
        .hidden = true;

    document
        .getElementById("characterDetailView")
        .hidden = false;

    document
        .getElementById("characterDetail")
        .innerHTML = `

<div class="breadcrumb">

<span
onclick="backToGroups()">
グループ一覧
</span>

＞

<span
onclick="
openOrganization(
'${info.organization}'
)">
${info.organization}
</span>

＞

<span
onclick="
openGrade(
'${info.grade}'
)">
${info.grade}
</span>

＞

<span
onclick="
openGroup(
'${info.group}'
)">
${info.group}
</span>

＞

${char.name}

</div>

<div class="character-header">

<div
class="color-chip"
style="
background:${info.color};
">
</div>

<h2
style="
color:${info.color};
">
${char.name}
</h2>

</div>

${info.image ? `
<img
src="${info.image}"
alt="${char.name}"
class="character-image">
` : ""}

<div class="card">

<h3 class="section-title">
プロフィール
</h3>

<p>
${char.summary}
</p>

<p>年齢：${info.age}</p>

<p>身長：${info.height}</p>

<p>誕生日：${char.birthday}</p>

</div>

<div class="card">

<h3 class="section-title">
話し方
</h3>

<p>一人称：${info.firstPerson}</p>

<p>二人称：${info.secondPerson}</p>

</div>

<div class="card">

<h3 class="section-title">
所属
</h3>

<p>

所属組織：

<span
class="relation-button"
onclick="
openTerm(
'${info.organization}'
)">
${info.organization}
</span>

</p>

<p>学年：${info.grade}</p>

<p>

所属グループ：

<span
class="relation-button"
onclick="
openTerm(
'${info.group}'
)">
${info.group}
</span>

</p>

<p>役職：${info.role}</p>

</div>

${createListSection(
    "外見",
    info.appearance
)}

<div class="card">

<h3 class="section-title">

能力

</h3>

<p>
${info.ability}
</p>

</div>

${createListSection(
    "能力説明",
    info.abilityDescriptions
)}

${createListSection(
    "好きなもの",
    info.likes
)}

${createListSection(
    "苦手なもの",
    info.dislikes
)}

${createListSection(
    "性格",
    info.personalities
)}

<div class="card">

<h3 class="section-title">

パラメータ

</h3>

${info.parameters.map(parameter=>`

<div class="parameter-item">

<span>
${parameter.name}
</span>

<span
class="parameter-stars"
style="color:${info.color}">
${"★".repeat(parameter.value)}
</span>

</div>

`).join("")}

</div>

${createListSection(
    "特技",
    info.skills
)}

${createListSection(
    "小ネタ",
    info.trivia
)}

${createListSection(
    "名言",
    info.quotes
)}

${createListSection(
    "家族構成",
    info.familyStructure
)}

<div class="card">

<h3 class="section-title">

関係人物

</h3>

${(info.relations || [])
.map(relation=>{

const target =
characters.find(
c=>c.id===relation.target
);

if(!target){
return "";
}

return `

<div
class="relation-button"
onclick="
openCharacter(
'${relation.target}'
)">
${target.name}
（${relation.emotion}）
</div>

`;

}).join("")}

</div>

${createListSection(
    "エピソード",
    info.episodes
)}

<div class="card">

<h3 class="section-title">

相関図

</h3>

<div class="relationship-graph">

<div class="relationship-node">

● ${char.name}

（現在表示中）

</div>

${(info.relations || [])
.map(relation=>{

const target =
characters.find(
c=>c.id===relation.target
);

if(!target){
return "";
}

return `

<div class="relationship-node">

└ ${relation.emotion}

→ ${target.name}

</div>

`;

}).join("")}

</div>

</div>

<div class="card">

<button
class="history-button"
onclick="
openHistory(
'${char.id}'
)">
⚠ 人物変遷を見る
</button>

</div>

`;
}

/* ------------------
   人物変遷
------------------- */

function openHistory(id){

    const char =
        characters.find(
            c=>c.id===id
        );

    document
        .getElementById(
            "historyModal"
        )
        .classList
        .remove("hidden");

    document
        .getElementById(
            "historyContent"
        )
        .innerHTML = `

<div class="compare-grid">

${createHistoryColumn(
    "過去",
    char.past
)}

${createHistoryColumn(
    "現在",
    char.present
)}

${createHistoryColumn(
    "未来",
    char.future
)}

</div>

`;
}

function createHistoryColumn(
    title,
    data
){

return `

<div class="compare-column">

<h3>${title}</h3>

<p>
年齢：
${data.age}
</p>

<p>
身長：
${data.height}
</p>

<p>
グループ：
${data.group}
</p>

<p>
役職：
${data.role}
</p>

<p>
能力：
${data.ability}
</p>

<p>
性格：
${data.personalities}
</p>

</div>

`;
}

/* ------------------
   モーダル閉じる
------------------- */

function closeHistory(){

    document
        .getElementById(
            "historyModal"
        )
        .classList
        .add("hidden");
}

/* ------------------
   戻る
------------------- */

function backToGroups(){

    document
        .getElementById("groupView")
        .hidden = false;

    document
        .getElementById("characterListView")
        .hidden = true;

    document
        .getElementById("characterDetailView")
        .hidden = true;
}

function backToCharacterList(){

    document
        .getElementById("characterListView")
        .hidden = false;

    document
        .getElementById("characterDetailView")
        .hidden = true;
}