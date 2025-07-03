// copy paste into discord browser console
// make sure to load the messages with videos first

(() => {
  const videos = [...document.querySelectorAll('video[src*="media.discordapp.net/attachments"]')];

  const linkLines = [];
  const messageLinesSet = new Set(); // Uavoid dupes

  videos.forEach(video => {
    const messageElem = video.closest('li');

    const authorSpan = messageElem?.querySelector('h3 span span[data-text]');
    const author = authorSpan?.getAttribute('data-text') || "Unknown Sender";
    const url = video.src;
    linkLines.push(`${url} (by ${author})`);
    const messageTextContainer = messageElem?.querySelector('[class*="markup"]');
    const messageText = messageTextContainer?.innerText.trim() || "";
    if (messageText) {
      messageLinesSet.add(messageText);
    }
  });

  // videoLinks.txt
  const linkBlob = new Blob([linkLines.join('\n')], { type: 'text/plain' });
  const linkUrl = URL.createObjectURL(linkBlob);
  const linkA = document.createElement('a');
  linkA.href = linkUrl;
  linkA.download = 'videoLinks.txt';
  linkA.click();
  URL.revokeObjectURL(linkUrl);

  // messages.txt
  const messageBlob = new Blob([Array.from(messageLinesSet).join('\n')], { type: 'text/plain' });
  const messageUrl = URL.createObjectURL(messageBlob);
  const messageA = document.createElement('a');
  messageA.href = messageUrl;
  messageA.download = 'messages.txt';
  messageA.click();
  URL.revokeObjectURL(messageUrl);
})();
