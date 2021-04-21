
export const customStyles = {
  headRow: {
    style: {
      minHeight: '56px',
      borderBottomWidth: '1px',
      borderBottomColor: 'rgba(0,0,0,0.08)',
      borderBottomStyle: 'solid',
    },
    denseStyle: {
      minHeight: '32px',
    },
  },
  headCells: {
    style: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: '12px',
      fontWeight: 600,
      color: 'rgba(68, 68, 68, 0.6)',
      paddingLeft: '16px',
      paddingRight: '16px',
    },
  },
  rows: {
    style: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: '14px',
      fontWeight: 400,
      color: 'rgba(68, 68, 68, 1)',
      minHeight: '48px',
      '&:not(:last-of-type)': {
        borderBottomStyle: 'solid',
        borderBottomWidth: '1px',
        borderBottomColor: 'rgba(0,0,0,0.08)',
      }
    },
    denseStyle: {
      minHeight: '32px',
    },
    selectedHighlightStyle: {
      // use nth-of-type(n) to override other nth selectors
      '&:nth-of-type(n)': {
        backgroundColor: 'rgba(0, 156, 234, 0.15)',
      },
    },
    highlightOnHoverStyle: {
      backgroundColor: 'rgb(244, 246, 247)',
      transitionDuration: '0.2s',
      transitionProperty: 'background-color',
      outlineStyle: 'solid',
      outlineWidth: '1px',
    }
  },
  pagination: {
    style: {
      color: 'rgba(68, 68, 68, 0.6)',
      fontFamily: '"Open Sans", sans-serif',
      fontSize: '13px',
      fontWeight: '600',
      paddingTop: '20px',
      minHeight: '56px',
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      borderTopColor: 'rgba(0,0,0,0.08)',
    },
    '&:nth-child(2) > svg': {
      top: '4px'
    },
    pageButtonsStyle: {
      borderRadius: '50%',
      height: '40px',
      width: '40px',
      padding: '8px',
      margin: 'px',
      cursor: 'pointer',
      transition: '0.4s',
      backgroundColor: 'transparent',
      '&:disabled': {
        cursor: 'unset',
        color: 'rgb(244, 246, 247)',
      },
      '&:hover:not(:disabled)': {
        backgroundColor: 'rgb(208, 210, 211)',
      },
      '&:focus': {
        outline: 'none',
      },
    },
  },
};
