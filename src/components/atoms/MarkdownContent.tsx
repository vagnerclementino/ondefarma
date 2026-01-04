import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

const StyledMarkdown = styled(Box)(({ theme }) => ({
  '& h1': {
    ...theme.typography.h4,
    color: theme.palette.primary.main,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  '& h2': {
    ...theme.typography.h5,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  '& h3': {
    ...theme.typography.h6,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  '& p': {
    ...theme.typography.body1,
    marginBottom: theme.spacing(2),
  },
  '& ul, & ol': {
    paddingLeft: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  '& li': {
    ...theme.typography.body1,
    marginBottom: theme.spacing(1),
  },
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  '& strong': {
    fontWeight: 600,
  },
  '& code': {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
    fontFamily: 'monospace',
  },
  '& pre': {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    overflow: 'auto',
    marginBottom: theme.spacing(2),
  },
}));

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const LinkRenderer = ({ href, children, ...props }: any) => {
    const isExternal = href && 
      (href.startsWith('http://') || href.startsWith('https://')) &&
      (typeof window === 'undefined' || !href.startsWith(window.location.origin)) &&
      !href.startsWith('mailto:') &&
      !href.startsWith('tel:');

    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      );
    }

    return <a href={href} {...props}>{children}</a>;
  };

  return (
    <StyledMarkdown>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{ a: LinkRenderer }}
      >
        {content}
      </ReactMarkdown>
    </StyledMarkdown>
  );
}
