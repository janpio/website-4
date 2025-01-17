/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import Post from 'components/pages/doc/post';
import { VERCEL_URL, MAX_TITLE_LENGTH } from 'constants/docs';
import LINKS from 'constants/links';
import { DEFAULT_IMAGE_PATH } from 'constants/seo-data';
import {
  DOCS_DIR_PATH,
  getAllPosts,
  getAllReleaseNotes,
  getBreadcrumbs,
  getDocPreviousAndNextLinks,
  getFlatSidebar,
  getPostBySlug,
  getSidebar,
  getTableOfContents,
} from 'utils/api-docs';
import getMetadata from 'utils/get-metadata';

const isUnusedOrSharedContent = (slug) =>
  slug.includes('unused/') ||
  slug.includes('shared-content/') ||
  slug.includes('README') ||
  slug.includes('GUIDE_TEMPLATE') ||
  slug.includes('RELEASE_NOTES_TEMPLATE');

export async function generateStaticParams() {
  const posts = await getAllPosts();

  if (!posts) return notFound();

  return posts.map(({ slug }) => {
    const slugsArray = slug.split('/');

    return {
      slug: slugsArray,
    };
  });
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const currentSlug = slug.join('/');

  if (isUnusedOrSharedContent(currentSlug)) return notFound();

  const post = getPostBySlug(currentSlug, DOCS_DIR_PATH);

  const isReleaseNotes = currentSlug === 'release-notes';

  if (!post) return notFound();

  const {
    data: { title },
    excerpt,
  } = post;

  const encodedTitle = Buffer.from(title).toString('base64');

  return getMetadata({
    title: `${title} - Neon Docs`,
    description: isReleaseNotes ? 'The latest product updates from Neon' : excerpt,
    imagePath:
      title.length < MAX_TITLE_LENGTH
        ? `${VERCEL_URL}/docs/og?title=${encodedTitle}`
        : DEFAULT_IMAGE_PATH,
    pathname: `${LINKS.docs}/${currentSlug}`,
    rssPathname: isReleaseNotes ? `${LINKS.releaseNotes}/rss.xml` : null,
    type: 'article',
  });
}

export default async function DocPost({ params }) {
  const { slug } = params;
  const currentSlug = slug.join('/');

  if (isUnusedOrSharedContent(currentSlug)) return notFound();

  const flatSidebar = await getFlatSidebar(getSidebar());

  const isReleaseNotesIndex = !!currentSlug.match('release-notes')?.length;
  const releaseNotes = await getAllReleaseNotes();

  const breadcrumbs = getBreadcrumbs(currentSlug, flatSidebar);
  const navigationLinks = getDocPreviousAndNextLinks(currentSlug, flatSidebar);
  const fileOriginPath = isReleaseNotesIndex
    ? process.env.NEXT_PUBLIC_RELEASE_NOTES_GITHUB_PATH
    : `${process.env.NEXT_PUBLIC_DOCS_GITHUB_PATH + currentSlug}.md`;

  if (!getPostBySlug(currentSlug, DOCS_DIR_PATH)) return notFound();

  const { data, content } = getPostBySlug(currentSlug, DOCS_DIR_PATH);
  const tableOfContents = getTableOfContents(content);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    author: {
      '@type': 'Organization',
      name: 'Neon',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Post
        content={content}
        data={data}
        breadcrumbs={breadcrumbs}
        navigationLinks={navigationLinks}
        isReleaseNotes={isReleaseNotesIndex}
        releaseNotesActiveLabel="all"
        currentSlug={currentSlug}
        fileOriginPath={fileOriginPath}
        releaseNotes={releaseNotes}
        tableOfContents={tableOfContents}
      />
    </>
  );
}
