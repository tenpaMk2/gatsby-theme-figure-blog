exports.onCreateNode = (
  { node, actions, getNode, createNodeId, createContentDigest },
  themeOptions
) => {
  const { createNode } = actions;

  if (node.id !== "SiteBuildMetadata") {
    return;
  }

  const fieldData = {
    slug: undefined,
    title: "bocchi the rock",
  };

  const hogePostId = createNodeId(`${node.id} >>> HogePost`);

  createNode({
    id: hogePostId,
    parent: node.id,
    children: [],
    internal: {
      type: `hoge`,
      contentDigest: createContentDigest(fieldData),
      content: JSON.stringify(fieldData),
      description: `hogehoge`,
    },
  });
};
