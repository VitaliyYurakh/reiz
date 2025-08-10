import { src, dest } from 'gulp';
import { paths } from '../config/paths.js';

export const root = () =>
  src(
    [
      `${paths.base.src}/robots.txt`,
      `${paths.base.src}/sitemap.xml`,
      'robots.txt',
      'sitemap.xml'
    ],
    { allowEmpty: true }
  ).pipe(dest(paths.base.build));
