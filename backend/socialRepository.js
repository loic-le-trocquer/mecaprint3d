const SocialPost = require('./models/SocialPost');
const SocialSettings = require('./models/SocialSettings');
const publicFields = { title: 1, content: 1, category: 1, image: 1, imageAlt: 1, publishedAt: 1, sourcePublishedDate: 1, sourceUrl: 1 };
module.exports = {
  async publishedForDistribution(id) { return SocialPost.findOne({ _id: id, status: 'published', publishedAt: { $ne: null } }).lean(); },
  async published(id) { return SocialPost.findOne({ _id: id, status: 'published', publishedAt: { $ne: null } }, publicFields).lean(); },
  async links() { return await SocialSettings.findOne({ key: 'main' }).select('facebook instagram linkedin -_id').lean() || { facebook: '', instagram: '', linkedin: '' }; },
  async setLinks(links) { await SocialSettings.findOneAndUpdate({ key: 'main' }, { $set: links }, { upsert: true, runValidators: true }); return links; },
  async posts(isPublic, page) {
    const limit = isPublic ? 12 : 30;
    const posts = await SocialPost.find(isPublic ? { status: 'published', publishedAt: { $ne: null } } : {}, isPublic ? publicFields : null).sort(isPublic ? { publishedAt: -1, _id: -1 } : { updatedAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit + 1).lean();
    return { posts: posts.slice(0, limit), hasMore: posts.length > limit };
  },
  async create(post) { return (await SocialPost.create({ ...post, publishedAt: post.status === 'published' ? new Date() : null })).toObject(); },
  async importDraft(post) {
    // Wait for the unique indexes before allowing imports, including concurrent retries.
    await SocialPost.init();
    const existing = await SocialPost.findOne({ $or: [{ importKey: post.importKey }, { sourceKeys: { $in: post.sourceKeys } }] }).select('_id').lean();
    if (existing) return { created: false };
    try {
      await SocialPost.create({ ...post, status: 'draft', publishedAt: null });
      return { created: true };
    } catch (error) {
      if (error.code === 11000) return { created: false };
      throw error;
    }
  },
  async update(id, post) {
    const existing = await SocialPost.findById(id);
    if (!existing) return null;
    const publishedAt = post.status === 'published' ? existing.publishedAt || new Date() : null;
    Object.assign(existing, post, { publishedAt });
    return (await existing.save()).toObject();
  },
  async remove(id) { return Boolean(await SocialPost.findByIdAndDelete(id)); }
};
