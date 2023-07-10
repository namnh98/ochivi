export const Colors = {
  mainColor: '#FF8800',
  primaryColor: '#f55a00',
  premiumColor: '#1a73e8',
  status(num) {
    switch (num) {
      case 0:
        return '#ff0000';
      case 1:
        return '#808000';
      case 2:
        return '#E87E04';
      case 3:
        return '#9acd32';
      case 4:
        return '#800080';
      case 5:
        return '#008000';
      case 6:
        return '#2e8b57';
      case 7:
        return '#228b22';
      case 8:
        return '#00008b';
      case 9:
        return '#8b0000';
    }
  },
  transaction_type(num) {
    switch (num) {
      case 0:
        return '#ff0000';
      case 1:
        return '#808000';
      case 2:
        return '#E87E04';
      case 3:
        return '#9acd32';
      case 4:
        return '#800080';
    }
  }
};

export const footerWrapper = {
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  flexDirection: 'row'
};
//non-container style wrapper for scrollview
export const footerWrapperNC = {
  flexDirection: 'column'
};

export const flexVCenter = {
  justifyContent: 'center'
};

export const flexCenter = {
  alignItems: 'center'
};

export const flexInline = {
  flexDirection: 'row'
};

export const flexCol = {
  flex: 1,
  flexDirection: 'column'
};

export const flex = {
  flex: 1
};

export const padding510 = {
  paddingTop: 5,
  paddingBottom: 5,
  paddingLeft: 10,
  paddingRight: 10
};

export const padding1520 = {
  paddingTop: 15,
  paddingBottom: 15,
  paddingLeft: 20,
  paddingRight: 20
};

export const padding1020 = {
  paddingTop: 10,
  paddingBottom: 10,
  paddingLeft: 20,
  paddingRight: 20
};

export const padding010 = {
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 10,
  paddingRight: 10
};
