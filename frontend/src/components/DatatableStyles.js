
export const customStyles = {
  headRow: {
    style: {
      minHeight: '56px',
      borderBottomWidth: '2px',
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
      fontSize: '14px',
      fontWeight: 600,
      color: 'rgba(68, 68, 68, 1)',
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
        backgroundColor: 'rgb(247, 248, 249)',
      },
    },
    highlightOnHoverStyle: {
      backgroundColor: 'rgba(247, 248, 249, 0.7)',
      transitionDuration: '0.2s',
      transitionProperty: 'background-color',
      outlineStyle: 'solid',
      outlineWidth: '1px',
    }
  }
};
