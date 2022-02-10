/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import List from '@material-ui/core/List';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItemCard from '../common/list-item-card';
import './styles.css';

class AccountList extends Component {
  constructor(props) {
    super(props);
    this.accountsEndRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (this.props.accounts && prevProps.accounts.length !== this.props.accounts.length) {
      this.scrollToBottom();
    }
  }

  scrollToBottom = () => {
    this.accountsEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  render() {
    const {
      classes,
      accounts,
      onCopyAddress,
      moreMenu,
      currentAccount,
      handleChangeAccount,
      onAccountMenuOptionsChange,
      isMoreVertIconVisible,
      colorTheme,
      theme,
      network,
      showFooterModal,
      handleFooterClick,
      handleFooterCancel,
      ...otherProps
    } = this.props;
    return (
      <div {...otherProps}>
        <List
          classes={{
            root: classes.root,
          }}
        >
          {accounts.map(account => (
            <ListItemCard
              theme={theme}
              listItem={account}
              handleListItemAvatarClick={handleChangeAccount}
              handleListItemClick={handleChangeAccount}
              primaryText={account.alias}
              address={account.address}
              onCopyAddress={onCopyAddress}
              moreMenu={moreMenu}
              isMoreVertIconVisible={isMoreVertIconVisible}
              onMoreMenuOptionsChange={onAccountMenuOptionsChange}
              isActive={currentAccount.address === account.address}
              className="account-card-container"
              style={{ background: colorTheme.card }}
              colorTheme={colorTheme}
              network={network}
              customModal={false}
              showRadio
              showFooterModal={showFooterModal}
              handleFooterClick={handleFooterClick}
              handleFooterCancel={handleFooterCancel}
            />
          ))}
        </List>
        <div ref={this.accountsEndRef} />
      </div>
    );
  }
}

const styles = () => ({
  root: {
    paddingTop: '0px !important',
  },
});

export default withStyles(styles)(AccountList);
