import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import TransferFromTo from '../transfer-from-to';
import FooterButton from '../../common/footer-button';
import FooterWithTwoButton from '../../common/footer-with-two-button';
import TransferFormAmount from '../transfer-form-amount';
import './styles.css';

class TransferForm extends Component {
  render() {
    const {
      address,
      theme,
      alias,
      to,
      amount,
      units,
      toRef,
      amountRef,
      isAddressEncoded,
      isToError,
      toErrorText,
      isAmountError,
      amountErrorText,
      unit,
      nextButtonText,
      backButtonText,
      amountPropName,
      toPropName,
      handleAmountChange,
      handleToChange,
      handleSendButton,
      handleBackButton,
      handleUnitOnChange,
      onAddressBookClick,
      t,
    } = this.props;
    return (
      <div className="transfer-form-container">
        <div className="transfer-form-top-container">
          <TransferFromTo
            address={address}
            theme={theme}
            alias={alias}
            isToError={isToError}
            isAddressEncoded={isAddressEncoded}
            toPropName={toPropName}
            to={to}
            toRef={toRef}
            toErrorText={toErrorText}
            handleToChange={handleToChange}
            onAddressBookClick={onAddressBookClick}
          />
        </div>
        <TransferFormAmount
          className="transfer-form-amount-container"
          error={isAmountError}
          label={t('Amount')}
          value={amount}
          helperText={amountErrorText}
          onChange={handleAmountChange}
          propName={amountPropName}
          inputRef={amountRef}
          options={units}
          dropDownValue={unit}
          onDropDownChange={handleUnitOnChange}
        />
        <FooterWithTwoButton
          onNextClick={handleSendButton}
          onBackClick={handleBackButton}
          backButtonName={backButtonText}
          nextButtonName={nextButtonText}
        />
      </div>
    );
  }
}

export default withTranslation()(TransferForm);
