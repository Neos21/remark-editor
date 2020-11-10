const unified = require('unified');
const remarkParse = require('remark-parse');
const remarkFrontmatter = require('remark-frontmatter');
const remarkSlug = require('remark-slug');
const remarkToc = require('remark-toc');
const remarkRehype = require('remark-rehype');
const rehypeAutolinkHeadings = require('rehype-autolink-headings');
const rehypePrism = require('@neos21/rehype-prism');
const rehypeStringify = require('rehype-stringify');
const rehypeFormat = require('rehype-format');

module.exports = (req, res) => {
  const processor = unified()
    .use(remarkParse, { commonmark: true, gfm: true, pedantic: true })
    .use(remarkFrontmatter, [{ type: 'yaml', marker: '-', anywhere: false }])
    .use(remarkSlug)
    .use(remarkToc, { heading: '目次', tight: true })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeAutolinkHeadings, {
      behavior: 'prepend',
      properties: { className: ['header-link'] },
      content: {
        type: 'element',
        tagName: 'span',
        properties: { className: ['header-link-mark'] },
        children: []
      }
    })
    .use(rehypePrism, {
      ignoreMissing: true,
      aliases: {
        bash: 'sh'
      }
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .use(rehypeFormat, { indent: 2, indentInitial: true });
  const result = processor.processSync(req.body);
  return res.send(result.contents);
};
