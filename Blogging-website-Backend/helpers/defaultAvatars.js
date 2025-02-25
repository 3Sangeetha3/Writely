const maleAvatars = [
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/3d_2.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/3d_4.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/bluey_2.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/bluey_3.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/bluey_8.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_1.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_3.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_13.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_14.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_22.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_23.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_24.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_34.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_35.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_1.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_2.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_5.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_7.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_8.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_9.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_10.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_14.png",
]

const femaleAvatars = [
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/bluey_1.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/3d_3.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/bluey_4.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/bluey_5.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/bluey_6.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/bluey_7.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/bluey_9.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/bluey_10.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_2.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_4.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_5.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_17.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_18.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_20.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_25.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_29.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_31.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_3.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_4.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_6.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_11.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_12.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_13.png",

]

const neutralAvatars = [
  "https://cdn.jsdelivr.net/gh/3Sangeetha3/writely-images-cdn@main/Avatar/defaultAvatar.png",
  "https://cdn.jsdelivr.net/gh/3Sangeetha3/writely-images-cdn@main/Avatar/user-profile.png",
];

function getRandomAvatar(pronouns) {
  if (pronouns === 'he') {
    return maleAvatars[Math.floor(Math.random() * maleAvatars.length)];
  }
  if (pronouns === 'she') {
    return femaleAvatars[Math.floor(Math.random() * femaleAvatars.length)];
  }
  return neutralAvatars[Math.floor(Math.random() * neutralAvatars.length)];
}

module.exports = {
  maleAvatars,
  femaleAvatars,
  neutralAvatars,
  getRandomAvatar,
};
