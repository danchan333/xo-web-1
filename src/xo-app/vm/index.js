import _ from 'messages'
import React, { Component } from 'react'
import xo from 'xo'
import { Row, Col } from 'grid'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import {
  connectStore,
  Debug,
  formatSize,
  normalizeXenToolsStatus,
  osFamily
} from 'utils'

import VmActionBar from './action-bar'

// ===================================================================

@connectStore((state, props) => {
  const { objects } = state
  const { id } = props.params

  const vm = objects[id]
  if (!vm) {
    return {}
  }

  return {
    container: objects[vm.$container],
    pool: objects[vm.$pool],
    vm
  }
})
export default class extends Component {
  componentWillMount () {
    xo.call('vm.stats', { id: this.props.params.id }).then((stats) => {
      this.setState({ stats })
    })
  }

  render () {
    const {
      container,
      pool,
      vm
    } = this.props

    if (!vm) {
      return <h1>Loading…</h1>
    }

    return <div>
      <Row>
        <Col size={6}>
          <h1>
            {vm.name_label}
            <small className='text-muted'> - {container.name_label} ({pool.name_label})</small>
          </h1>
          <p className='lead'>{vm.name_description}</p>
        </Col>
        <Col size={6}>
          <VmActionBar vm={vm} handlers={this.props} />
        </Col>
      </Row>
      <Tabs>
        <TabList>
          <Tab>{_('generalTabName')}</Tab>
          <Tab>{_('statsTabName')}</Tab>
          <Tab>{_('consoleTabName')}</Tab>
          <Tab>{_('disksTabName', { disks: vm.$VBDs.length })}</Tab>
          <Tab>{_('networkTabName')}</Tab>
          <Tab>{_('snapshotsTabName')}</Tab>
          <Tab>{_('logsTabName')}</Tab>
          <Tab>{_('advancedTabName')}</Tab>
        </TabList>
        <TabPanel>
          { /* TODO: use CSS style */ }
          <br/>
          <Row className='text-xs-center'>
            <Col size={3}>
              <h2>{vm.CPUs.number}x <i className='xo-icon-cpu fa-lg'></i></h2>
            </Col>
            <Col size={3}>
              { /* TODO: compute nicely RAM units */ }
              <h2>{formatSize(vm.memory.size)} <i className='xo-icon-memory fa-lg'></i></h2>
            </Col>
            <Col size={3}>
              { /* TODO: compute total disk usage */ }
              <h2>{vm.$VBDs.length}x <i className='xo-icon-disk fa-lg'></i></h2>
            </Col>
            <Col size={3}>
              <h2>{vm.VIFs.length}x <i className='xo-icon-network fa-lg'></i></h2>
            </Col>
          </Row>
          { /* TODO: use CSS style */ }
          <br/>
          {vm.xenTools
            ? <Row className='text-xs-center'>
              <Col size={6}>
                <pre>{vm.addresses['0/ip'] ? vm.addresses['0/ip'] : _('noIpv4Record')}</pre>
              </Col>
              <Col size={6}>
                { /* TODO: tooltip and better icon usage */ }
                <h1><i className={'icon-' + osFamily(vm.os_version.distro)} /></h1>
              </Col>
            </Row>
            : <Row className='text-xs-center'>
              <Col size={12}><em>{_('noToolsDetected')}.</em></Col>
            </Row>
          }
          { /* TODO: use CSS style */ }
          <br/>
          <Row>
            <Col size={12}>
              { /* TODO: tag display component */ }
              <p className='text-xs-center'>Tags: </p>
            </Col>
          </Row>
        </TabPanel>
        <TabPanel>
          <Debug value={this.state} />
        </TabPanel>
        <TabPanel>
          <h2>noVNC stuff</h2>
        </TabPanel>
        <TabPanel>
          <Debug value={vm} />
        </TabPanel>
        <TabPanel>
          <div className='col-md-6'>
            <h2>Network stuff</h2>
          </div>
        </TabPanel>
        <TabPanel>
          <div className='col-md-6'>
            <h2>Snapshot stuff</h2>
          </div>
        </TabPanel>
        <TabPanel>
          <div className='col-md-6'>
            <h2>Log stuff</h2>
          </div>
        </TabPanel>
        <TabPanel>
          <Row>
            <Col size={12}>
              <dl className='dl-horizontal'>
                <dt>{_('uuid')}</dt>
                <dd>{vm.uuid}</dd>

                <dt>{_('virtualizationMode')}</dt>
                <dd>{vm.virtualizationMode}</dd>

                <dt>{_('xenToolsStatus')}</dt>
                <dd>{_('xenToolsStatusValue', { status: normalizeXenToolsStatus(vm.xenTools) })}</dd>

                <dt>{_('osName')}</dt>
                <dd>{vm.os_version ? vm.os_version.name : _('unknownOsName')}</dd>

                <dt>{_('osKernel')}</dt>
                <dd>{vm.os_version ? vm.os_version.uname : _('unknownOsKernel')}</dd>

                <dt>{_('autoPowerOn')}</dt>
                <dd>{vm.auto_poweron ? _('enabledAutoPowerOn') : _('disabledAutoPowerOn')}</dd>

                <dt>{_('ha')}</dt>
                <dd>{vm.high_availability ? _('enabledHa') : _('disabledHa')}</dd>

                <dt>{_('originalTemplate')}</dt>
                <dd>{vm.other.base_template_name ? vm.other.base_template_name : _('unknownOriginalTemplate')}</dd>
              </dl>
            </Col>
          </Row>
        </TabPanel>
      </Tabs>
    </div>
  }
}
