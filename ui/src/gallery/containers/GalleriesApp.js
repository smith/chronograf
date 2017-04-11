import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import {getMeasurements, getGallery} from 'src/gallery/apis'
import {Links} from 'src/utils/ajax'
import _ from 'lodash'

class GalleriesApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      apps: {},
    }
  }

  componentDidMount() {
    const source = this.props.source
    getMeasurements(source.links.proxy, source.telegraf).then((measurements) => {
      Links().then(({data}) => {
        getGallery(data.dashboardd, measurements).then((resp) => {
          const apps = _.groupBy(_.get(resp, 'data.layouts', []), 'app')
          this.setState({apps})
        })
      })
    })
  }

  render() {
    const apps = _.keys(this.state.apps)
    const {source} = this.props

    return (
      <div className="page">
        <div className="page-header">
          <div className="page-header__container">
            <div className="page-header__left">
              <h1>
                Dashboard Gallery
              </h1>
            </div>
          </div>
        </div>
        <div className="page-contents">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="panel panel-minimal">
                  <div className="panel-body">
                    <table className="table v-center admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                      {
                        apps.map((app) => {
                          const id = _.head(this.state.apps[app]).id
                          return (
                            <tr key={id} className="">
                              <td className="monotype">
                                <Link
                                  to={{pathname: `/sources/${source.id}/gallery/${app}`}}>
                                  {app}
                                </Link>
                              </td>
                            </tr>
                          )
                        })
                      }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const {
  shape,
  string,
} = PropTypes

GalleriesApp.propTypes = {
  source: shape({
    id: string.isRequired,
    links: shape({
      proxy: string.isRequired,
    }).isRequired,
    telegraf: string.isRequired,
  }),
}

export default GalleriesApp