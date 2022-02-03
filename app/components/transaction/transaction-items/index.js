import React, { Component } from 'react';
import TransactionItem from '../transaction-item';
import { CRUST_MAXWELL_NETWORK } from '../../../../lib/constants/networks';
import './styles.css';

export default class TransactionItems extends Component {
  render() {
    const {
      transactions, network, account, colorTheme, ...otherProps
    } = this.props;
    return (
      <div {...otherProps}>
        {transactions.map(transaction => (
          <div key={transaction.block_timestamp}>
            <TransactionItem
              className="transaction-item"
              transaction={transaction}
              network={network}
              account={account}
              colorTheme={colorTheme}
              style={{
                background: colorTheme.card,
                boxShadow: network.value === CRUST_MAXWELL_NETWORK.value ? 'none' : '',
              }}
            />
          </div>
        ))}
      </div>
    );
  }
}
