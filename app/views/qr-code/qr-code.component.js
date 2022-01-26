import React, { Component } from 'react';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import { withTranslation } from 'react-i18next';
import SubHeader from '../../components/common/sub-header';
import QRCodeForm from '../../components/qr-code/qr-code-form';
import { copyAccountMessage } from '../../../lib/services/static-message-factory-service';
import { colorTheme } from '../../../lib/constants/colors';
import './styles.css';

class QRCode extends Component {
  handleSubheaderBackBtn = () => {
    this.props.changePage(this.props.backupPage);
  };

  onCopy = () => {
    const { t } = this.props;
    this.props.createToast({ message: t(copyAccountMessage()), type: 'info' });
  };

  render() {
    const { account, network, t } = this.props;
    const theme = 'substrate';
    return (
      <div
        className="qr-code-container"
        style={{ background: colorTheme[network.value].background }}
      >
        <SubHeader
          icon={
            <ArrowBackIosOutlinedIcon
              style={{ color: colorTheme[network.value].text.secondary, fontSize: '14px' }}
            />
          }
          title={t('Receive')}
          backBtnOnClick={this.handleSubheaderBackBtn}
          isBackIcon
          colorTheme={colorTheme[network.value]}
        />
        <QRCodeForm
          className="qr-code-form-container"
          theme={theme}
          account={account}
          onCopyAddress={this.onCopy}
          onClick={this.handleSubheaderBackBtn}
          colorTheme={colorTheme[network.value]}
          style={{ background: colorTheme[network.value].background }}
        />
      </div>
    );
  }
}

export default withTranslation()(QRCode);
