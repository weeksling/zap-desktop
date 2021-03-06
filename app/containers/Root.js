// @flow
import React from 'react'
import { Provider, connect } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import PropTypes from 'prop-types'

import LoadingBolt from '../components/LoadingBolt'
import LndSyncing from '../components/LndSyncing'
import { fetchBlockHeight, lndSelectors } from '../reducers/lnd'
import { newAddress } from '../reducers/address'
import Routes from '../routes'

const mapDispatchToProps = {
  fetchBlockHeight,
  newAddress
}

const mapStateToProps = state => ({
  lnd: state.lnd,
  address: state.address,

  syncPercentage: lndSelectors.syncPercentage(state)
})

const Root = ({
  store,
  history,
  lnd,
  newAddress, // eslint-disable-line no-shadow
  fetchBlockHeight, // eslint-disable-line no-shadow
  syncPercentage,
  address
}) => {
  // If we are syncing show the syncing screen
  if (lnd.syncing) {
    return (
      <LndSyncing
        newAddress={newAddress}
        fetchBlockHeight={fetchBlockHeight}
        syncPercentage={syncPercentage}
        address={address}
        grpcStarted={lnd.grpcStarted}
      />
    )
  }

  // Don't launch the app without gRPC connection
  if (!lnd.grpcStarted) { return <LoadingBolt /> }

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Provider>
  )
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  lnd: PropTypes.object.isRequired,
  fetchBlockHeight: PropTypes.func.isRequired,
  newAddress: PropTypes.func.isRequired,
  syncPercentage: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  address: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)
