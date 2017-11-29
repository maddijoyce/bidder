import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import moment from 'moment';

import query from './auction.graphql';
import auctionsQuery from './auctions.graphql';
import mutation from './update.graphql';
import imageMutation from '../../components/field/image.graphql';
import { Form, Field, Area, Image, Button } from '../../components/field';
import { updateForm, clearForm } from '../../components/field/reducer';
import Chevron from '../../components/icons/chevron-left.svg';
import Bag from '../../components/icons/shopping-bag.svg';
import Align from '../../components/icons/align-left.svg';
import Camera from '../../components/icons/camera-alt.svg';
import Calendar from '../../components/icons/calendar-alt.svg';
import Upload from '../../components/icons/cloud-upload.svg';

class EditAuction extends Component {
  static propTypes = {
    isNew: PropTypes.bool,
    auction: PropTypes.object,
    onBack: PropTypes.func,
    onUpdate: PropTypes.func,
    signedUrl: PropTypes.func,
    onError: PropTypes.func,
    onComplete: PropTypes.func,
  };

  static validation = {
    title: [
      (v) => (!v && 'is missing'),
    ],
    finishAt: [
      (v) => (!v && 'is missing'),
      (v) => (!moment(v).isAfter() && 'is in the past'),
    ],
  };

  onSubmit = async ({ pictureFile, ...fields }) => {
    const { match, signedUrl, onUpdate, onError, onComplete } = this.props;

    try {
      let picture = fields.picture;
      if (pictureFile) {
        const result = await signedUrl(pictureFile.type);
        await fetch(result.data.signedUrl.uploadUrl, { method: 'PUT', body: pictureFile });
        picture = result.data.signedUrl.imageUrl;
      }
      const result = await onUpdate(match.params.id, { ...fields, picture });
      onComplete(result.data.updateAuction.id);
    } catch (e) {
      if (e.graphQLErrors) {
        const errors = e.graphQLErrors[0].state;
        if (errors.image) errors.picture = errors.image;
        onError(errors);
      } else {
        console.log(e);
      }
    }
  };

  render() {
    const { isNew, onBack, auction } = this.props;

    const finishAt = new Date();
    finishAt.setTime(finishAt.getTime() + (60 * 60 * 1000));

    return (
      <div className="collections">
        <h1>
          <Button onClick={onBack} icon={Chevron} className="clear" />
          {isNew ? 'New Auction' : `Edit '${auction.title}'`}
        </h1>
        <Form name="auction" initial={isNew ? { finishAt: finishAt.toISOString() } : auction} onSubmit={this.onSubmit} validation={EditAuction.validation}>
          <Field
            name="title"
            label="Title"
            icon={Bag}
          />
          <Area
            name="description"
            label="Description"
            icon={Align}
          />
          <Image
            name="picture"
            label="Picture"
            icon={Camera}
          />
          <Field
            name="finishAt"
            type="datetime-local"
            label="Finishes At"
            icon={Calendar}
          />
          <Button type="submit" text="Save Auction" className="blue" icon={Upload} />
        </Form>
      </div>
    );
  }
}

const composed = compose(
  graphql(imageMutation, {
    props: ({ mutate }) => ({
      signedUrl: (type) => mutate({ variables: { type } }),
    }),
  }),
  graphql(mutation, {
    props: ({ mutate, ownProps: { isNew, me } }) => ({
      onUpdate: (id, fields) => mutate({
        variables: { id, fields },
        update(store, { data: { updateAuction } }) {
          if (isNew) {
            const data = store.readQuery({
              query: auctionsQuery,
              variables: { me: (me || {}).id },
            });
            data.myAuctions.unshift(updateAuction);
            store.writeQuery({
              data,
              query: auctionsQuery,
              variables: { me: (me || {}).id },
            });
          }
        },
      }),
    })
  }),
  graphql(query, {
    props: ({ data: { auction } }) => ({
      auction: auction || {},
    }),
    options: ({ match: { params } }) => ({
      variables: {
        id: params.id,
      },
    }),
  }),
  connect(null, (dispatch, { match: { params } }) => ({
    onBack() { dispatch(push(`/${params.id || ''}`)); },
    onError(values) { dispatch(updateForm({ form: 'auctionErrors', values })); },
    onComplete(id) {
      dispatch(clearForm({ form: 'auction' }));
      dispatch(clearForm({ form: 'auctionErrors' }));
      dispatch(push(`/${id}`));
    },
  })),
)(EditAuction);

export default composed;
