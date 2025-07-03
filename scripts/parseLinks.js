var fs = require('fs');

let links = fs.readFileSync("./videoLinks.txt", "utf-8");
let linkArr = links.split('\n').map(msg => msg.split(' (by ')[0]);

let messages = fs.readFileSync("./messages.txt", "utf-8");
let messageArr = messages.split('\r\n');


let messagesObj = [];
for (let i = 0; i < messageArr.length; i += 3) {
    let name = messageArr[i].split(': ')[1]
    let file = messageArr[i + 2].split(': ')[1]
    messagesObj.push({ name, file, link: null });
}

linkArr.forEach(link => {
    let filename = link.split('/')[6].split('?')[0]
    let index = messagesObj.findIndex(el => el.file === filename);
    if (index === -1) return;

    messagesObj[index].link = link;
});

messagesObj = messagesObj.filter(el => el.link !== null);

fs.writeFileSync("./parsedMessages.json", JSON.stringify(messagesObj, null, 4));
