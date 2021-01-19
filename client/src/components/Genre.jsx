import React from 'react';
import styled from 'styled-components';

const GenreStyled = styled.div`
  height: 36px;
`;

const ParaStyled = styled.p`
  margin: 0;
  padding: 0;
`;

const SpanStyled = styled.span`
  color: white;
  margin: 0;
  padding: 0;
`;

const Genre = (props) => {
  console.log(props);
  // const genres = props.genres.map((genre, index) => {
  //   return <SpanStyled key={index}> {genre}</SpanStyled>;
  // });   ---------production code

  return (
    <GenreStyled>
      <ParaStyled>GENRE</ParaStyled>
      {/* below line is production code.  next line is for demo purposes */}
      {/* {genres} */}
      <SpanStyled key={'hi'}> {props.genres}</SpanStyled>
    </GenreStyled>
  );
};

export default Genre;
