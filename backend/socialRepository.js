const SocialPost = require('./models/SocialPost');
const SocialSettings = require('./models/SocialSettings');
const publicFields = { title: 1, content: 1, category: 1, image: 1, imageAlt: 1, publishedAt: 1 };
module.exports = {
  async links() { return await SocialSettings.findOne({ key: 'main' }).select('facebook instagram linkedin -_id').lean() || { facebook: '', instagram: '', linkedin: '' }; },
  async setLinks(links) { await SocialSettings.findOneAndUpdate({ key: 'main' }, { $set: links }, { upsert: true, runValidators: true }); return links; },
  async posts(isPublic, page) {
    const limit = isPublic ? 12 : 30;
    const posts = await SocialPost.find(isPublic ? { status: 'published', publishedAt: { $ne: null } } : {}, isPublic ? publicFields : null).sort(isPublic ? { publishedAt: -1, _id: -1 } : { updatedAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit + 1).lean();
    return { posts: posts.slice(0, limit), hasMore: posts.length > limit };
  },
  async create(post) { return (await SocialPost.create({ ...post, publishedAt: post.status === 'published' ? new Date() : null })).toObject(); },
  async update(id, post) {
    const existing = await SocialPost.findById(id);
    if (!existing) return null;
    const publishedAt = post.status === 'published' ? existing.publishedAt || new Date() : null;
    Object.assign(existing, post, { publishedAt });
    return (await existing.save()).toObject();
  },
  async remove(id) { return Boolean(await SocialPost.findByIdAndDelete(id)); }
};
