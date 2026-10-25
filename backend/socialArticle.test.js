const {test}=require('node:test');const assert=require('node:assert/strict');const express=require('express');
const {socialEmbed,articleUrl}=require('./socialEmbed');const {renderArticle}=require('./socialArticle');
test('Intégrations : seuls les liens Facebook et codes officiels LinkedIn sont autorisés',()=>{
 const fb=socialEmbed('https://www.facebook.com/mecaprint/posts/123?tracking=discard');assert.equal(fb.platform,'facebook');assert.equal(fb.sourceUrl,'https://www.facebook.com/mecaprint/posts/123');assert.match(fb.frameUrl,/plugins\/post.php/);
 const li=socialEmbed('<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:123456" onload="alert(1)"></iframe>');assert.equal(li.frameUrl,'https://www.linkedin.com/embed/feed/update/urn:li:share:123456');assert.ok(!li.sourceUrl.includes('onload'));
 for(const source of ['javascript:alert(1)','https://www.linkedin.com.evil.test/embed/feed/update/urn:li:share:123','https://user:pass@www.facebook.com/x/posts/1','<script>alert(1)</script>','https://www.linkedin.com/feed/update/urn:li:activity:123','https://www.facebook.com/profile.php?id=1'])assert.throws(()=>socialEmbed(source));
 assert.equal(socialEmbed(''),null);
});
test('Article : texte indexable, métadonnées, lien du site et contenu échappé',()=>{
 const html=renderArticle({_id:'0123456789abcdef01234567',title:'Une pièce <script>',content:'Projet détaillé\n\n<img onerror="attack">',category:'realisation',image:'https://example.com/piece.jpg',sourceUrl:'https://www.facebook.com/mecaprint/posts/123',visitorToken:'private-test',socialText:'Texte social privé'});
 assert.ok(html.includes('property="og:url"'));assert.ok(html.includes(articleUrl('0123456789abcdef01234567')));assert.ok(html.includes('Projet détaillé'));assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<img onerror'));assert.ok(!html.includes('private-test'));assert.ok(!html.includes('Texte social privé'));assert.ok(!html.includes('<iframe'));assert.ok(html.includes('id="load-post"'));assert.ok(html.includes('Demander un devis'));
});
test('Pages publiques : une publication absente ou privée reste inaccessible',async t=>{
 const id='0123456789abcdef01234567';const post={_id:id,title:'Une pièce réelle',content:'Description complète',category:'realisation'};
 const app=express();const {createSocialRouter}=require('./routes/social');app.use('/api/social',createSocialRouter({async published(key){return key===id ? post : null;}}));
 const server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));t.after(()=>new Promise(resolve=>server.close(resolve)));const base=`http://127.0.0.1:${server.address().port}/api/social/article/`;
 const ok=await fetch(base+id);assert.equal(ok.status,200);assert.match(ok.headers.get('content-type'),/text\/html/);assert.match(await ok.text(),/Une pièce réelle/);assert.equal((await fetch(base+'invalid')).status,404);assert.equal((await fetch(base+'ffffffffffffffffffffffff')).status,404);
});
test('MongoDB : les brouillons et préparations ne sont jamais utilisés pour les pages publiques',async t=>{
 const Post=require('./models/SocialPost');let query;t.mock.method(Post,'findOne',(q)=>{query=q;return{async lean(){return null;}};});await require('./socialRepository').published('0123456789abcdef01234567');assert.equal(query.status,'published');assert.deepEqual(query.publishedAt,{$ne:null});
});
test('Partage social : lien détaillé ajouté uniquement pour les publications publiques',async()=>{
 const {socialShareText}=await import('../frontend/src/lib/publicationLinks.mjs');
 const post={_id:'0123456789abcdef01234567',title:'Titre',content:'Texte',status:'published'};assert.ok(socialShareText(post).includes(articleUrl(post._id)));assert.equal(socialShareText({...post,status:'draft'}),'Texte');assert.equal(socialShareText({...post,socialText:articleUrl(post._id)}),articleUrl(post._id));
 const html=renderArticle({_id:'0123456789abcdef01234567',title:'Titre',content:'Texte',category:'realisation'});assert.ok(html.includes('sharing/share-offsite/'));assert.ok(html.includes(encodeURIComponent(articleUrl('0123456789abcdef01234567'))));
});
