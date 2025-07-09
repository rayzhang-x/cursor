import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Input,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardImg,
  Spinner,
  Alert
} from 'reactstrap';

interface Pokemon {
  name: string;
  sprites: { front_default: string };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}

function App() {
  const [search, setSearch] = useState('');
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPokemon = async () => {
    setLoading(true);
    setError('');
    setPokemon(null);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`);
      if (!res.ok) throw new Error('Pokémon not found');
      const data = await res.json();
      setPokemon(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center mb-4">
        <Col md={6} lg={4}>
          <Input
            type="text"
            placeholder="Enter Pokémon name or ID"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchPokemon()}
          />
        </Col>
        <Col md="auto">
          <Button color="primary" onClick={fetchPokemon} disabled={loading || !search}>
            Search
          </Button>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          {loading && <Spinner color="primary" />}
          {error && <Alert color="danger">{error}</Alert>}
          {pokemon && (
            <Card className="mt-4 shadow">
              <CardImg
                top
                width="100%"
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                style={{ background: '#f2f2f2', objectFit: 'contain', height: 200 }}
              />
              <CardBody>
                <CardTitle tag="h3" className="text-capitalize">{pokemon.name}</CardTitle>
                <CardText>
                  <strong>Types:</strong> {pokemon.types.map(t => t.type.name).join(', ')}
                </CardText>
                <CardText>
                  <strong>Abilities:</strong> {pokemon.abilities.map(a => a.ability.name).join(', ')}
                </CardText>
                <CardText>
                  <strong>Stats:</strong>
                  <ul className="mb-0">
                    {pokemon.stats.map(s => (
                      <li key={s.stat.name} className="text-capitalize">
                        {s.stat.name}: {s.base_stat}
                      </li>
                    ))}
                  </ul>
                </CardText>
              </CardBody>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
