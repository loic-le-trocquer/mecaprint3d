const siteOrigin = 'https://www.mecaprint3d.fr';
const articleUrl = id => `${siteOrigin}/actualites/${id}`;
function socialEmbed(value = '') {
  if (!value) return null;
  if (typeof value !== 'string' || value.length > 5000) throw new Error('Lien de publication invalide.');
  let input=value.trim();
  if (!input) return null;
  if (/^<iframe\b/i.test(input)) {
    const match=input.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
    if (!match) throw new Error('Le code intégré doit contenir une adresse src.');
    input=match[1].replace(/&amp;/g,'&');
  }
  let url;try{url=new URL(input);}catch{throw new Error('Collez le lien HTTPS Facebook ou le code « Intégrer » LinkedIn.');}
  if(url.protocol!=='https:' || url.username || url.password || url.port || input.length>2000)throw new Error('Publication HTTPS uniquement.');
  if(['facebook.com','www.facebook.com','m.facebook.com'].includes(url.hostname)){
    if(url.pathname==='/plugins/post.php'){
      const href=url.searchParams.get('href');if(!href)throw new Error('Lien Facebook incomplet.');return socialEmbed(href);
    }
    if(!(/\/(posts|videos)\//.test(url.pathname) || /^\/(permalink|story|photo)\.php$/.test(url.pathname) || /^\/photo\/?$/.test(url.pathname) || /^\/share\/[pv]\//.test(url.pathname)))throw new Error('Utilisez le lien d’une publication Facebook, pas celui du profil.');
    url.hash='';for(const key of [...url.searchParams.keys()])if(!['story_fbid','id','fbid','v','set'].includes(key))url.searchParams.delete(key);
    return { platform:'facebook', sourceUrl:url.href, frameUrl:`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url.href)}&show_text=true&width=500` };
  }
  if(['linkedin.com','www.linkedin.com'].includes(url.hostname)){
    const match=url.pathname.match(/^\/(?:embed\/)?feed\/update\/(urn:li:(?:share|ugcPost):\d+)\/?$/);
    if(!match)throw new Error('LinkedIn : ouvrez « … » sur une publication publique, puis « Intégrer cette publication », et collez le code fourni. Certains formats ne sont pas intégrables.');
    return { platform:'linkedin', sourceUrl:`https://www.linkedin.com/embed/feed/update/${match[1]}`, frameUrl:`https://www.linkedin.com/embed/feed/update/${match[1]}`, originalUrl:`https://www.linkedin.com/feed/update/${match[1]}` };
  }
  throw new Error('Seuls Facebook et LinkedIn sont acceptés.');
}
module.exports={socialEmbed,siteOrigin,articleUrl};
