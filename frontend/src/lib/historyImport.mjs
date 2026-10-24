export function prepareHistoryFile(data) {
  if (data?.schemaVersion !== 1 || !Array.isArray(data.posts) || !data.posts.length || data.posts.length > 1000) throw new Error('Fichier de préparation historique invalide.');
  const posts = data.posts.map(post => {
    const refs = post.sources || (post.source ? [post.source] : []);
    if (typeof post.title !== 'string' || typeof post.content !== 'string' || !post.content.trim() || !Array.isArray(refs) || !refs.length) throw new Error('Un contenu est incomplet.');
    return {
      title: post.title, content: post.content, socialText: post.socialText || post.content,
      category: post.category || 'actualite', status: 'draft', channels: [],
      image: post.image || '', imageAlt: post.imageAlt || '',
      sources: refs.map(ref => ({
        platform: ref.platform, id: ref.id, url: ref.url, publishedDate: ref.publishedDate,
        originalText: post.sourceVariants?.find(variant => variant.source?.platform === ref.platform && variant.source?.id === ref.id)?.originalText || post.content
      }))
    };
  });
  return { posts, missingCount: Array.isArray(data.needsCompletion) ? data.needsCompletion.length : 0 };
}
export function historyBatches(posts) {
  const batches = [];
  let current = [];
  for (const post of posts) {
    const next = [...current, post];
    if (current.length && (next.length > 10 || new TextEncoder().encode(JSON.stringify({ posts: next })).length > 60000)) {
      batches.push(current); current = [];
    }
    current.push(post);
    if (new TextEncoder().encode(JSON.stringify({ posts: current })).length > 900000) throw new Error('Une publication dépasse la taille maximale d’import.');
  }
  if (current.length) batches.push(current);
  return batches;
}
