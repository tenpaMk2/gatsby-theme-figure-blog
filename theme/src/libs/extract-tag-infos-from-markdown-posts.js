/**
 * Extract tag infos from markdown posts.
 *
 * @param  {[]} markdownPosts Markdown posts that has `tags` .
 * @returns {[{name: string, slug: string, count: number}]} Tag infos.
 */
const extractTagInfosFromPosts = (markdownPosts) => {
  if (!markdownPosts) {
    throw new Error(`Argument must be array of \`MarkdownPost\` .`);
  }

  const allTags = markdownPosts
    ?.map(({ tags }) => tags)
    .flat()
    .filter((tag) => tag); // remove `null` when the post has no tags.

  const postCounts = {};
  allTags.forEach(({ name }) => {
    postCounts[name] = (postCounts[name] || 0) + 1;
  });

  const uniqueTagNames = Array.from(
    new Set(allTags.map(({ name }) => name))
  ).filter((x) => x);
  const uniqueTagSlugs = Array.from(
    new Set(allTags.map(({ slug }) => slug))
  ).filter((x) => x);

  if (uniqueTagNames.length !== uniqueTagSlugs.length) {
    console.table({ uniqueTagNames });
    console.table({ uniqueTagSlugs });
    return new Error(
      `Unique tag-names length and unique tag-slugs length are not match. Maybe there are orthographic variants?`
    );
  }

  // make unique tag info.
  const tagInfos = [];
  for (let i = 0; i < uniqueTagNames.length; i++) {
    const name = uniqueTagNames[i];
    const slug = uniqueTagSlugs[i];
    const count = postCounts[name];
    tagInfos.push({ name, slug, count });
  }

  return tagInfos;
};

module.exports = {
  extractTagInfosFromPosts,
};
