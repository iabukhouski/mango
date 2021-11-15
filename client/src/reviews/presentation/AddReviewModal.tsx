import * as R from 'ramda';
import { Form, Field } from 'react-final-form'
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useAppDispatch } from '../../app/hooks';
import { Review, PartialReview } from '../reviews.d';
import { createReviewThunk } from '../slice';

const StyledBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StyledPaper = styled(Paper)`
  padding: 30px;
`;

type AddReviewModalProps = {
  onClose: () => void;
  open: boolean;
  productId: Review['productId'];
};

export const required = (value: unknown) => {

  return (
    R.isNil(value) || value === ``
      ? `Required`
      : undefined
  );
};

export const AddReviewModal = (
  {
    onClose,
    open,
    productId,
  }: AddReviewModalProps,
) => {

  const dispatch = useAppDispatch();

  const onSubmit = (partialReview: PartialReview) => {

    dispatch(
      createReviewThunk(
        {
          productId,
          partialReview,
        },
      ),
    );

    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Container fixed>
        <StyledBox>
          <StyledPaper>
            <Form
              onSubmit={onSubmit}
            >
              {({ handleSubmit }) => {

                return (
                  <form onSubmit={handleSubmit}>
                    <Stack
                      spacing={2}
                    >
                      <Typography id='modal-modal-title' variant='h1' component='h1'>
                        What is your rating
                      </Typography>
                      <Typography id='modal-modal-title' variant='h2' component='h2'>
                        Rating
                      </Typography>

                      <Field<number, HTMLElement, string>
                        precision={0.5}
                        name='score'
                        type='radio'
                        validate={required}
                        parse={
                          (value) => {

                            return (
                              R.isNil(value)
                                ? value
                                : parseFloat(value)
                            );
                          }
                        }
                      >
                        {
                          ({ input, meta, ...props }) => {

                            const isError = meta.touched === true && !R.isNil(meta.error);

                            return (
                              <>
                                {isError && <span>{meta.error}</span>}
                                <Rating
                                  onChange={
                                    (_, value) => {

                                      input.onChange(value);
                                    }
                                  }
                                  {...props}
                                  data-testid='Rating'
                                />
                              </>
                            );
                          }
                        }
                      </Field>
                      <Typography id='modal-modal-title' variant='h2' component='h2'>
                        Review
                      </Typography>
                      <Field
                        fullWidth
                        maxRows={4}
                        multiline
                        name='description'
                        type='text'
                        validate={required}
                      >
                        {
                          ({ input, meta, ...props }) => {

                            const isError = meta.touched === true && !R.isNil(meta.error);

                            return (
                              <>
                                {isError && <span>{meta.error}</span>}
                                <TextField
                                  {...input}
                                  {...props}
                                  error={isError}
                                  data-testid='Description'
                                />
                              </>
                            );
                          }
                        }
                      </Field>
                      <Button variant='contained' type='submit' size='small'>Submit Review</Button>
                    </Stack>
                  </form>
                );
              }}
            </Form>
          </StyledPaper>
        </StyledBox>
      </Container>
    </Modal>
  );
};
