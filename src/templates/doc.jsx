/* eslint-disable react/prop-types */
import clsx from 'clsx';
import { graphql } from 'gatsby';
import React, { useRef } from 'react';

import MobileNav from 'components/pages/doc/mobile-nav';
import PreviousAndNextLinks from 'components/pages/doc/previous-and-next-links';
import Sidebar from 'components/pages/doc/sidebar';
import TableOfContents from 'components/pages/doc/table-of-contents';
import Hero from 'components/pages/release-notes/hero';
import Pagination from 'components/pages/release-notes/pagination';
import ReleaseNoteList from 'components/pages/release-notes/release-note-list';
import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Layout from 'components/shared/layout';
import Search from 'components/shared/search';
import SEO from 'components/shared/seo';
import SEO_DATA from 'constants/seo-data';

const ReleaseNotes = ({ nodes, pageCount, currentPageIndex }) => (
  <>
    <Hero />
    <ReleaseNoteList items={nodes} />
    {pageCount > 1 && <Pagination currentPageIndex={currentPageIndex} pageCount={pageCount} />}
  </>
);
const DocTemplate = ({
  data: {
    mdx: {
      body,
      frontmatter: { title, enableTableOfContents },
    },
    allMdx: { nodes },
  },
  pageContext: {
    sidebar,
    currentSlug,
    isReleaseNotes,
    previousLink,
    nextLink,
    pageCount,
    currentPageIndex,
  },
}) => {
  const contentRef = useRef(null);

  return (
    <Layout headerTheme="white">
      <div className="safe-paddings pt-48 pb-48 3xl:pt-44 3xl:pb-44 2xl:pt-40 2xl:pb-40 xl:pt-32 xl:pb-32 lg:pt-12 lg:pb-24 md:pt-6 md:pb-20">
        <Container className="grid-gap-x grid grid-cols-12 lg:block" size="md">
          <Sidebar
            className="col-start-2 col-end-4 pt-3 2xl:col-start-1 lg:hidden"
            sidebar={sidebar}
            currentSlug={currentSlug}
          />
          <Search className="hidden lg:block" />
          <MobileNav className="mt-5 hidden lg:block" sidebar={sidebar} currentSlug={currentSlug} />
          <div
            className={clsx('xl:col-span-9 lg:mt-6', isReleaseNotes ? 'col-span-7' : 'col-span-6')}
          >
            {isReleaseNotes ? (
              <ReleaseNotes
                nodes={nodes}
                pageCount={pageCount}
                currentPageIndex={currentPageIndex}
              />
            ) : (
              <article>
                <h1 className="t-5xl font-semibold">{title}</h1>
                <Content className="mt-5" content={body} ref={contentRef} />
              </article>
            )}
            <PreviousAndNextLinks previousLink={previousLink} nextLink={nextLink} />
          </div>
          {enableTableOfContents && <TableOfContents contentRef={contentRef} />}
        </Container>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query ($id: String!, $limit: Int, $skip: Int) {
    mdx(id: { eq: $id }) {
      excerpt(pruneLength: 160)
      body
      frontmatter {
        title
        enableTableOfContents
      }
    }
    allMdx(
      filter: { fileAbsolutePath: { regex: "/release-notes/" }, slug: { ne: "release-notes" } }
      sort: { order: DESC, fields: slug }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        slug
        body
        frontmatter {
          label
        }
      }
    }
  }
`;

export default DocTemplate;

export const Head = ({
  location: { pathname },
  data: {
    mdx: {
      excerpt,
      frontmatter: { title },
    },
  },
}) => <SEO pathname={pathname} {...SEO_DATA.doc({ title, description: excerpt })} />;
