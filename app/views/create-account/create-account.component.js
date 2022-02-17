import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import CrustValidator from '../../utils/crust-validator';
import validator from '../../utils/crust-validator/validator';
import CreateAccountForm from '../../components/account/create-account-form';
import CreateAccountSettings from '../../components/account/create-account-settings';
import FooterButton from '../../components/common/footer-button';
import SubHeader from '../../components/common/sub-header';
import * as Account from '../../constants/account';
import './styles.css';
import AlertDailog from '../../components/common/alert-dialog';
import { colorTheme } from '../../../lib/constants/colors';
import { CRUST_NETWORK } from '../../../lib/constants/networks';
import { CREATE_ACCOUNT_ENTRY_PAGE, MANAGE_ACCOUNT_PAGE } from '../../constants/navigation';
import { copySeedPhraseMessage } from '../../../lib/services/static-message-factory-service';

class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValue: Account.CREATE_ACCOUNT,
      buttonName: Account.TO_CONFIRM_BUTTON_TEXT,
      onSubmit: this.handleNext,
      importedSeedPhrase: '',
      confirmSeedPhrase: '',
      isPhraseError: false,
      phraseErrorMsg: '',
      isError: false,
      errorMessage: null,
      alias: '',
      disableAccountSettings: false,
      isAliasError: false,
      aliasErrorMessage: null,
      importSeedPhraseInputName: 'importedSeedPhrase',
      confirmSeedPhraseInputName: 'confirmSeedPhrase',
      aliasInputName: 'alias',
      password: '',
      isOpen: false,
    };
    this.validator = new CrustValidator(validator.importSeedPhraseValidation);
    this.aliasValidator = new CrustValidator(validator.aliasValidation);
    this.aliasInput = React.createRef();
    this.seedInput = React.createRef();
    this.confirmSeedInput = React.createRef();
  }

  componentDidMount() {
    const { aliasError, seedWords, resetImportAccountWithSeedPhraseError } = this.props;
    this.props.updateBackupPage(this.props.page);
    if (aliasError) {
      resetImportAccountWithSeedPhraseError();
      this.setState({
        isAliasError: false,
        aliasErrorMessage: null,
      });
    }

    if (seedWords) {
      this.setState({
        buttonName: Account.TO_CONFIRM_BUTTON_TEXT,
        formValue: Account.CREATE_ACCOUNT,
        disableAccountSettings: false,
      });
    } else {
      this.setState({
        buttonName: Account.IMPORT_BUTTON_TEXT,
        formValue: Account.IMPORT_ACCOUNT,
        disableAccountSettings: false,
      });
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.error) {
      return {
        isError: true,
        errorMessage: props.error.message,
        isAliasError: false,
        aliasErrorMessage: '',
      };
    }
    if (props.aliasError) {
      return {
        isAliasError: true,
        aliasErrorMessage: 'Duplicate alias.',
        isError: false,
        errorMessage: '',
      };
    }
    if (props.seedWords) {
      return {
        buttonName: Account.TO_CONFIRM_BUTTON_TEXT,
        formValue: Account.CREATE_ACCOUNT,
        disableAccountSettings: false,
      };
    }
    if (!props.seedWords) {
      return {
        buttonName: Account.IMPORT_BUTTON_TEXT,
        formValue: Account.IMPORT_ACCOUNT,
        disableAccountSettings: false,
      };
    }
    return state;
  }

  handleChange = value => {
    let {
      buttonName, formValue, onSubmit, disableAccountSettings
    } = this.state;
    if (value === Account.CREATE_ACCOUNT) {
      buttonName = Account.TO_CONFIRM_BUTTON_TEXT;
      onSubmit = this.handleNext;
      formValue = Account.CREATE_ACCOUNT;
      disableAccountSettings = false;
    }
    if (value === Account.IMPORT_ACCOUNT) {
      buttonName = Account.IMPORT_BUTTON_TEXT;
      onSubmit = this.handleImportSeedWordClick;
      formValue = Account.IMPORT_ACCOUNT;
      disableAccountSettings = false;
    }
    this.setState({
      buttonName,
      formValue,
      onSubmit,
      disableAccountSettings,
    });
  };

  handleImportSeedWordsChange = () => e => {
    const { value } = e.target;
    const { error, resetImportAccountWithSeedPhraseError } = this.props;
    if (error) {
      resetImportAccountWithSeedPhraseError();
    }
    this.setState({
      importedSeedPhrase: value,
    });
  };

  handleAliasChange = prop => e => {
    const { value } = e.target;

    this.setState({
      [prop]: value,
    });
  };

  handlePasswordChange = prop => e => {
    const { value } = e.target;
    this.setState({
      [prop]: value,
    });
  };

  handleSeedWordImportOnMount = () => {
    this.setState({
      importedSeedPhrase: '',
    });
  };

  handelBack = () => {
    const { backupPage } = this.props;
    this.props.changePage(backupPage);
    this.props.resetImportAccountWithSeedPhraseError();
  };

  handleCloseDialog = () => {
    this.setState({
      isOpen: false,
    });
  };

  handleYes = () => {
    this.setState({
      isOpen: false,
    });
    const { alias, password, importedSeedPhrase } = this.state;
    const { seedWords, t } = this.props;
    const word = this.state.formValue === Account.IMPORT_ACCOUNT ? importedSeedPhrase : seedWords;
    this.props.createFirstAccountWithSeedPhrase(word, alias, password, t);
  };

  handelConfirm = () => {
    this.setState({
      isOpen: true,
    });
  };

  handleNext = () => {
    this.props.resetImportAccountWithSeedPhraseError();
    this.handleImportSeedWordClick();
  };

  handleImportSeedWordClick = () => {
    const {
      alias, importedSeedPhrase, password, formValue
    } = this.state;

    if (formValue === Account.IMPORT_ACCOUNT) {
      const { isPhraseError, phraseErrorMsg } = this.validateSeedPhrase(importedSeedPhrase);

      if (isPhraseError) {
        this.setState({
          isPhraseError,
          phraseErrorMsg,
          isAliasError: false,
          aliasErrorMessage: null,
          isError: false,
          errorMessage: null,
        });
        this.seedInput.focus();
        return;
      }
    }

    const { isAliasError, aliasErrorMessage } = this.validateAlias(alias);

    if (isAliasError) {
      this.setState({
        isPhraseError: false,
        phraseErrorMsg: null,
        isAliasError,
        aliasErrorMessage,
        isError: false,
        errorMessage: null,
      });
      return;
    }

    const { isError, errorMessage } = this.validatePassword(password);
    if (isError) {
      this.setState({
        isPhraseError: false,
        phraseErrorMsg: null,
        isAliasError: false,
        aliasErrorMessage: null,
        isError,
        errorMessage,
      });
      return;
    }
    if (formValue === Account.IMPORT_ACCOUNT) {
      this.handleYes();
    } else {
      this.handelConfirm();
    }
  };

  onKeypairTypeChange = (event, keypair) => {
    this.props.setKeypairType(keypair.value);
  };

  handleAliasOnBlur = () => {
    const { isAliasError, aliasErrorMessage } = this.validateAlias(this.state.alias);
    if (this.state.alias === '' || !isAliasError) {
      this.setState({
        isAliasError,
        aliasErrorMessage,
      });
    }
  };

  handleSeedWordsOnBlur = () => {
    const { isPhraseError, phraseErrorMsg } = this.validateSeedPhrase(
      this.state.importedSeedPhrase,
    );
    if (this.state.importedSeedPhrase === '' || isPhraseError) {
      this.setState({ isPhraseError, phraseErrorMsg });
      this.seedInput.focus();
    }
  };

  handleConfirmSeedWordsOnBlur = () => {
    const { isError, errorMessage } = this.validateSeedPhrase(this.state.confirmSeedPhrase);
    if (this.state.confirmSeedPhrase === '' || isError) {
      this.setState({ isError, errorMessage });
      this.seedInput.focus();
    }
  };

  handleBack = () => {
    const { account } = this.props;
    this.props.resetImportAccountWithSeedPhraseError();
    if (account) {
      this.props.changePage(MANAGE_ACCOUNT_PAGE);
    } else {
      this.props.changePage(CREATE_ACCOUNT_ENTRY_PAGE);
    }
  };

  onCopySeed = () => {
    const { t } = this.props;
    this.props.createToast({ message: t(copySeedPhraseMessage()), type: 'info' });
  };

  validateAlias(alias) {
    let { isAliasError, aliasErrorMessage } = this.state;
    if (alias !== '') {
      const aliasValidation = this.aliasValidator.validate({
        alias,
      });
      if (!aliasValidation.isValid) {
        isAliasError = true;
        aliasErrorMessage = aliasValidation.alias.message;
      } else {
        isAliasError = false;
        aliasErrorMessage = null;
      }
    } else {
      isAliasError = true;
      aliasErrorMessage = 'Alias is required';
    }
    return {
      isAliasError,
      aliasErrorMessage,
    };
  }

  validateSeedPhrase(importedSeedPhrase) {
    let { isPhraseError, phraseErrorMsg } = this.state;
    if (!importedSeedPhrase || importedSeedPhrase === '') {
      return {
        isPhraseError: true,
        phraseErrorMsg: 'Phrase is required',
      };
    }
    const validation = this.validator.validate({
      seedPhrase: importedSeedPhrase,
    });
    if (!validation.isValid) {
      isPhraseError = true;
      phraseErrorMsg = validation.seedPhrase.message;
    } else {
      isPhraseError = false;
      phraseErrorMsg = null;
    }

    return {
      isPhraseError,
      phraseErrorMsg,
    };
  }

  validatePassword(password) {
    if (!password || password === '') {
      return {
        isError: true,
        errorMessage: 'Password is required.',
      };
    }
    return {
      isError: false,
      errorMessage: null,
    };
  }

  render() {
    const {
      seedWords, keypairType, keypairTypes, network, t
    } = this.props;
    const {
      formValue,
      buttonName,
      onSubmit,
      importedSeedPhrase,
      confirmSeedPhrase,
      isError,
      errorMessage,
      isAliasError,
      aliasErrorMessage,
      alias,
      password,
      disableAccountSettings,
      importSeedPhraseInputName,
      confirmSeedPhraseInputName,
      aliasInputName,
      isPhraseError,
      phraseErrorMsg,
    } = this.state;
    return (
      <div
        className="create-account-container"
        style={{ background: colorTheme[network ? network.value : CRUST_NETWORK.value].background }}
      >
        <SubHeader
          icon={<ArrowBackIosOutlinedIcon style={{ color: '#858B9C', fontSize: '14px' }} />}
          title={t('Generate')}
          backBtnOnClick={this.handleBack}
          subMenu={null}
          showSettings={false}
          onSubMenuOptionsChange={null}
          isBackIcon
          colorTheme={colorTheme[network ? network.value : CRUST_NETWORK.value]}
        />
        <CreateAccountForm
          value={formValue}
          generatedSeedWords={seedWords}
          importedSeedWords={importedSeedPhrase}
          confirmedSeedWords={confirmSeedPhrase}
          onChange={this.handleImportSeedWordsChange}
          handleSeedWordImportOnMount={this.handleSeedWordImportOnMount}
          importSeedPhraseInputName={importSeedPhraseInputName}
          confirmSeedPhraseInputName={confirmSeedPhraseInputName}
          alias={alias}
          isError={isPhraseError}
          errorMessage={t(phraseErrorMsg)}
          seedRef={input => {
            this.seedInput = input;
          }}
          confirmSeedRef={input => {
            this.confirmSeedInput = input;
          }}
          handleSeedWordsOnBlur={this.handleSeedWordsOnBlur}
          handleConfirmSeedWordsOnBlur={this.handleConfirmSeedWordsOnBlur}
          className="create-account-form"
          colorTheme={colorTheme[network ? network.value : CRUST_NETWORK.value]}
          onCopySeed={this.onCopySeed}
        />
        <CreateAccountSettings
          disableAccountSettings={disableAccountSettings}
          alias={alias}
          handleAliasChange={this.handleAliasChange}
          aliasPropName="alias"
          aliasLabel={t('Nickname')}
          isAliasError={isAliasError}
          aliasErrorMessage={t(aliasErrorMessage)}
          keypairType={keypairType}
          keypairTypes={keypairTypes}
          onKeypairTypeChange={this.onKeypairTypeChange}
          aliasInputName={aliasInputName}
          aliasRef={input => {
            this.aliasInput = input;
          }}
          colorTheme={colorTheme[network ? network.value : CRUST_NETWORK.value]}
          handleAliasOnBlur={this.handleAliasOnBlur}
          handlePasswordChange={this.handlePasswordChange}
          aliasPassworkPropName="passoword"
          passwordLabel={t('Password')}
          password={password}
          isPasswordError={isError}
          passwordErrorMessage={t(errorMessage)}
          className={
            formValue === Account.IMPORT_ACCOUNT
              ? 'create-account-settings-import'
              : 'create-account-settings'
          }
        />
        <FooterButton
          name={t(buttonName)}
          onClick={onSubmit}
          style={{ paddingLeft: 20, paddingRight: 16 }}
        />
        <AlertDailog
          isOpen={this.state.isOpen}
          handleClose={this.handleCloseDialog}
          handleYes={this.handleYes}
          noText={t('Go Back')}
          yesText={t('Next')}
          importVaultFileName={
            <ErrorOutlineOutlinedIcon style={{ color: '#000000', fontSize: '44px' }} />
          }
          msg={t('Make sure you have saved the seed phrase.')}
        />
      </div>
    );
  }
}

export default withTranslation()(CreateAccount);

CreateAccount.defaultProps = {
  seedWords: '',
  createFirstAccountWithSeedPhrase: undefined,
  error: null,
  resetImportAccountWithSeedPhraseError: undefined,
};

CreateAccount.propTypes = {
  createFirstAccountWithSeedPhrase: PropTypes.func,
  error: PropTypes.string,
  resetImportAccountWithSeedPhraseError: PropTypes.func,
  seedWords: PropTypes.string,
};
