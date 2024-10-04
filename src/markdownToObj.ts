export const markdownToObj = async (markdown: string) => {
  const { unified } = await import("unified");
  const remarkParse = await import("remark-parse");

  const tree = unified().use(remarkParse.default).parse(markdown);
  console.log(tree);
  return tree;
};

export default markdownToObj;
