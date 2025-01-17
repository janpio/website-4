import clsx from 'clsx';
import PropTypes from 'prop-types';

import Content from 'components/shared/content';
import Link from 'components/shared/link';
import LoadMorePosts from 'components/shared/load-more-posts';
import generateReleaseNotePath from 'utils/generate-release-note-path';
import getReleaseNotesDateFromSlug from 'utils/get-release-notes-date-from-slug';

const ReleaseNoteList = ({ className, items }) => (
  <div className={clsx('sm:space-y-7', className)}>
    <LoadMorePosts className="mt-14" defaultCountPosts={10} countToAdd={10} isReleaseNotes>
      {items.map(({ slug, content }, index) => {
        const { datetime, label } = getReleaseNotesDateFromSlug(slug);
        const releaseNotesPath = generateReleaseNotePath(slug);

        return (
          <article className="group flex first:mt-0 lg:flex-col lg:space-y-3" key={index}>
            <div
              className={clsx(
                'relative ml-1.5 w-full pl-7 pb-10 group-last:pb-0 before:absolute before:-left-1 before:top-2.5 before:z-10 before:h-[9px] before:w-[9px] before:rounded-full before:bg-primary-1 after:absolute after:bottom-0 after:left-0 after:top-0 after:h-auto after:w-px after:bg-gray-7 group-first:after:top-2.5 group-last:after:bottom-4 dark:before:bg-secondary-2 dark:after:bg-gray-2 md:pb-7 sm:ml-0 sm:max-w-full sm:pb-0 sm:pl-0 sm:before:hidden sm:after:hidden'
              )}
            >
              <Link
                className="transition-colors duration-200 hover:text-secondary-8 dark:hover:text-green-45"
                to={releaseNotesPath}
              >
                <h2 className="whitespace-nowrap text-xl font-semibold leading-normal">
                  <time dateTime={datetime}>{label}</time>
                </h2>
              </Link>

              <Content
                className="mt-5 prose-h3:mt-[18px] prose-h3:text-lg"
                content={content}
                withoutAnchorHeading
                isReleaseNote
              />
            </div>
          </article>
        );
      })}
    </LoadMorePosts>
  </div>
);

ReleaseNoteList.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ReleaseNoteList;
