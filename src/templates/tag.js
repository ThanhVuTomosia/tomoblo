import React from "react";
import PropTypes from "prop-types";
import { Link, graphql } from "gatsby";
import "../stylesheets/application.scss";

import Layout from "../components/layout";
import SEO from "../components/seo";
import Sidebar from "../components/sidebar/Sidebar";
import TechTag from "../components/tags/TechTag";
import { excerpt } from '../utils/common.js';

const Tag = ({ pageContext, data }) => {
  const posts = data.allMarkdownRemark.edges;
  const labels = data.site.siteMetadata.labels;
  const { tag } = pageContext;
  const { totalCount } = data.allMarkdownRemark;
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? "" : "s"
    } tagged with "${tag}"`;

  const getTechTags = tags => {
    const techTags = [];
    tags.forEach((tag, i) => {
      labels.forEach(label => {
        if (tag === label.tag) {
          techTags.push(
            <TechTag
              key={i}
              tag={label.tag}
              tech={label.tech}
              name={label.name}
              size={label.size}
              color={label.color}
            />
          );
        }
      });
    });
    return techTags;
  };

  return (
    <Layout>
      <SEO
        title="Home"
        keywords={[
          `gatsby`,
          `javascript`,
          `react`,
          `web development`,
          `node.js`,
          `graphql`
        ]}
      />
      <div className="index-main">
        <div className="sidebar">
          <Sidebar />
        </div>

        <div className="post-list-main">
          <i>
            <h2 className="title">{tagHeader}</h2>
          </i>
          {posts.map(post => {
            const tags = post.node.frontmatter.tags;
            return (
              <div key={post.node.id} className="container mt-5">
                <Link to={post.node.fields.slug} className="text-dark">
                  <h2 className="title">{post.node.frontmatter.title}</h2>
                </Link>

                <small className="d-block text-muted reading-time">
                  {post.node.frontmatter.date} <span className="dot">●</span> {post.node.fields.readingTime.text}
                </small>

                <div className="snippet mt-3 d-inline" dangerouslySetInnerHTML={{ __html: excerpt(post) }} />
                <div className="d-block">{getTechTags(tags)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

Tag.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired
            })
          })
        }).isRequired
      )
    })
  })
};

export const pageQuery = graphql`
  query($tag: String) {
    site {
      siteMetadata {
        title
        author
        labels {
          tag
          tech
          name
          size
          color
        }
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          excerpt(pruneLength: 200)
          snippet
          html
          id
          frontmatter {
            title
            date(formatString: "DD-MM-YYYY")
            tags
          }
          fields {
            slug
            readingTime {
              text
            }
          }
        }
      }
    }
  }
`;

export default Tag;